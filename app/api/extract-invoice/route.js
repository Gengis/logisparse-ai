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

        if (!file) return Response.json({ error: "No se subió archivo" }, { status: 400 });

        // 1. Guardar archivo temporal
        const buffer = Buffer.from(await file.arrayBuffer());
        const tempPdfPath = path.join(process.cwd(), 'temp_factura.pdf');
        const outDir = path.join(process.cwd(), 'output');

        // Aseguramos que la carpeta output exista
        await fs.mkdir(outDir, { recursive: true });
        await fs.writeFile(tempPdfPath, buffer);

        // 2. Extraer solo la primera página para QVAC
        const pdfData = await pdf(buffer);
        const primeraPagina = pdfData.text.substring(0, 1500);

        console.log("[SYS] Iniciando procesamiento paralelo (Python + QVAC)...");

        // 3. Ejecución Paralela
        const [pythonResult, qvacResult] = await Promise.all([
            // Hilo 1: Script de Python
            execPromise(`python3 procesar_factura.py ${tempPdfPath} ${outDir}`),


        ]);

        // 4. Leer el CSV generado y convertirlo a JSON
        const csvFilePath = path.join(outDir, 'factura_items.csv');
        const jsonProductos = await csv().fromFile(csvFilePath);

        await close();

        // 5. Devolver el JSON híbrido unificado
        return Response.json({
            status: "success",
            remitente_destinatario: qvacResult,
            productos: jsonProductos
        });

    } catch (error) {
        console.error("[ERROR HÍBRIDO]", error);
        try { await close(); } catch (e) { }
        return Response.json({ error: "Fallo en el motor híbrido" }, { status: 500 });
    }
}