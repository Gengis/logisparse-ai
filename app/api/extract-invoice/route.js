import { exec } from 'child_process';
import util from 'util';
import fs from 'fs/promises';
import path from 'path';
import pdf from 'pdf-extraction';
import csv from 'csvtojson';
import { completion, LLAMA_3_2_1B_INST_Q4_0, loadModel, unloadModel, close } from "@qvac/sdk";

const execPromise = util.promisify(exec);

export async function POST(request) {
    try {
        const data = await request.formData();
        const file = data.get('file');
        if (!file) return Response.json({ error: "Missing file payload" }, { status: 400 });

        const buffer = Buffer.from(await file.arrayBuffer());
        const tempPdfPath = path.join(process.cwd(), 'temp_factura.pdf');
        const outDir = path.join(process.cwd(), 'output');

        await fs.mkdir(outDir, { recursive: true });
        await fs.writeFile(tempPdfPath, buffer);

        const pdfData = await pdf(buffer);
        const primeraPagina = pdfData.text.substring(0, 1500);

        // Parallel execution: spatial parsing via python & zero-shot extraction via QVAC
        const [pythonResult, qvacResult] = await Promise.all([
            execPromise(`/Users/gengisrovi/miniconda3/bin/python procesar_factura.py ${tempPdfPath} ${outDir}`),
            (async () => {
                const modelId = await loadModel({ modelSrc: LLAMA_3_2_1B_INST_Q4_0, modelType: "llm" });
                const history = [
                    { role: "system", content: "Eres un liquidador de aduanas. Extrae la empresa Remitente, empresa Destinataria y el Incoterm. Devuelve ÚNICAMENTE un JSON." },
                    { role: "user", content: `Analiza el encabezado.\nREGLAS ESTRICTAS:\n1. No uses nombres de cosméticos o perfumes.\n2. Busca entidades legales (S.A., Corp, LLC).\n3. Si no encuentras, usa "Desconocido".\n4. Los valores deben ser strings, no objetos.\n\nTEXTO:\n${primeraPagina}\n\nFORMATO:\n{"remitente": "", "destinatario": "", "incoterm": ""}` }
                ];

                const result = completion({ modelId, history, stream: true });
                let textoAcumulado = "";
                for await (const token of result.tokenStream) textoAcumulado += token;

                await unloadModel({ modelId });

                const jsonMatch = textoAcumulado.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    try {
                        return JSON.parse(jsonMatch[0]);
                    } catch (e) {
                        console.warn("[WARN] JSON parse failed on QVAC output");
                        return { remitente: "Revisión manual", destinatario: "Revisión manual", incoterm: "Desconocido" };
                    }
                }
                return { remitente: "Desconocido", destinatario: "Desconocido", incoterm: "Desconocido" };
            })()
        ]);

        const csvFilePath = path.join(outDir, 'factura_items.csv');
        const jsonProductos = await csv().fromFile(csvFilePath);

        await close();

        return Response.json({
            status: "success",
            remitente_destinatario: qvacResult,
            productos: jsonProductos
        });

    } catch (error) {
        console.error("[ERR_HYBRID_ENGINE]", error);
        try { await close(); } catch (e) { }
        return Response.json({ error: "Pipeline failure" }, { status: 500 });
    }
}