import pdf from 'pdf-extraction';
import { completion, LLAMA_3_2_1B_INST_Q4_0, loadModel, unloadModel, close } from "@qvac/sdk";
import Tesseract from 'tesseract.js';

const arrayBuffer = await file.arrayBuffer();
if (arrayBuffer.byteLength === 0) {
    return Response.json({ error: "El archivo está vacío" }, { status: 400 });
}

const buffer = Buffer.from(arrayBuffer);
let textoCompleto = "";

if (file.type === 'application/pdf') {
    console.log("[SYS] Procesando PDF...");
    const pdfData = await pdf(buffer);
    textoCompleto = pdfData.text;
} else if (file.type.startsWith('image/')) {
    console.log("[SYS] Fotografía detectada. Iniciando OCR local...");
    // 'spa' asegura que lea correctamente la letra 'ñ' y tildes en español
    const resultadoOcr = await Tesseract.recognize(buffer, 'spa');
    textoCompleto = resultadoOcr.data.text;
} else {
    return Response.json({ error: "Formato no soportado" }, { status: 400 });
}
try {
    pdfData = await pdf(buffer);
} catch (err) {
    return Response.json({ error: "PDF encriptado o corrupto" }, { status: 422 });
}

const textoFactura = pdfData.text.trim();
if (textoFactura.length < 50) {
    return Response.json({ error: "El PDF es una imagen sin texto o ilegible" }, { status: 422 });
}

export async function POST(request) {
    try {
        const data = await request.formData();
        const file = data.get('file');

        if (!file) return Response.json({ error: "No se subió archivo" }, { status: 400 });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const pdfData = await pdf(buffer);
        const textoFactura = pdfData.text.substring(0, 2000);

        console.log("[SYS] Procesando con IA Soberana...");

        const modelId = await loadModel({ modelSrc: LLAMA_3_2_1B_INST_Q4_0, modelType: "llm" });
        const history = [{
            role: "user",
            content: `Analiza este documento logístico y extrae: 1. Remitente, 2. Destinatario, 3. Peso Total, 4. Costo Total. Devuelve ESTRICTAMENTE JSON sin texto adicional.\n\n${textoFactura}`
        }];

        const result = completion({ modelId, history, stream: true });

        let rawJson = "";
        for await (const token of result.tokenStream) {
            rawJson += token;
        }

        await unloadModel({ modelId });
        await close();

        const cleanJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
        return Response.json(JSON.parse(cleanJson));

    } catch (error) {
        console.error("[ERROR]", error);
        return Response.json({ error: "Fallo en la extracción soberana" }, { status: 500 });
    }
}