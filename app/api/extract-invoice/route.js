import fs from 'fs/promises';
import path from 'path';
import pdf from 'pdf-extraction';
import { completion, LLAMA_3_2_1B_INST_Q4_0, loadModel, unloadModel, close } from "@qvac/sdk";

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');
    if (!file) return Response.json({ error: "Missing file payload" }, { status: 400 });

        const buffer = Buffer.from(await file.arrayBuffer());

        // 1. Extracción limpia de texto
        const pdfData = await pdf(buffer);
        const textoLimpio = pdfData.text.replace(/\s+/g, ' ');

        // Truncamos inteligente: inicio (empresas) + final (totales e incoterms)
        const textoParaIA = textoLimpio.substring(0, 2500) + "\n...\n" + textoLimpio.slice(-1500);

        // 2. Extracción Cognitiva con QVAC (Cero dependencias de Python)
        const modelId = await loadModel({ modelSrc: LLAMA_3_2_1B_INST_Q4_0, modelType: "llm" });

        const history = [
            {
                role: "system",
                content: `Eres un liquidador de aduanas. Analiza el documento y extrae los datos generales de la transacción.
DEVUELVE ÚNICAMENTE UN OBJETO JSON con las siguientes claves exactas:
- "remitente": Nombre o razón social de la empresa emisora.
- "destinatario": Nombre o razón social del cliente o comprador.
- "incoterm": Término de comercio (ej. EXW, FOB, CIF).
- "resumen_mercancia": Descripción breve de los productos detectados.
- "monto_total": Monto final o total general de la factura.`
            },
            { role: "user", content: `TEXTO DE LA FACTURA:\n${textoParaIA}` }
        ];

        const result = completion({ modelId, history, stream: true, format: "json" });
        let textoAcumulado = "";
        for await (const token of result.tokenStream) textoAcumulado += token;

        await unloadModel({ modelId });
        await close();

        // 3. Parsing del resultado
        const jsonMatch = textoAcumulado.match(/\{[\s\S]*\}/);
        let qvacResult = {
            remitente: "Desconocido",
            destinatario: "Desconocido",
            incoterm: "Desconocido",
            resumen_mercancia: "No especificado",
            monto_total: "No detectado"
        };

        if (jsonMatch) {
            try {
                qvacResult = JSON.parse(jsonMatch[0]);
            } catch (e) {
                console.warn("[WARN] Parsing de JSON fallido, usando fallback.");
            }
        }

        return Response.json({
            status: "success",
            datos_generales: qvacResult
        });

    } catch (error) {
        console.error("[ERR_QVAC_ENGINE]", error);
        try { await close(); } catch (e) { }
        return Response.json({ error: "Fallo en el procesamiento local de la factura" }, { status: 500 });
    }
}