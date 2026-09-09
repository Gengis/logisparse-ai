import fs from 'fs';
import pdf from 'pdf-extraction';
import { completion, LLAMA_3_2_1B_INST_Q4_0, loadModel, unloadModel, close } from "@qvac/sdk";

// ... (fs y pdf-extraction arriba)
const dataBuffer = fs.readFileSync('Fake data invoice (Cocle-Herrera).pdf');
const pdfData = await pdf(dataBuffer);
const lineas = pdfData.text.split('\n'); // Separamos por saltos de línea reales

// Ensamblamos bloques inteligentes que no superen los 1000 caracteres
const fragmentos = [];
let bloqueActual = "";
for (const linea of lineas) {
    if (bloqueActual.length + linea.length > 1000) {
        fragmentos.push(bloqueActual);
        bloqueActual = "";
    }
    bloqueActual += linea + "\n";
}
if (bloqueActual) fragmentos.push(bloqueActual);

let facturaConsolidada = { productos: [] };
const modelId = await loadModel({ modelSrc: LLAMA_3_2_1B_INST_Q4_0, modelType: "llm" });

for (let i = 0; i < fragmentos.length; i++) {
    console.log(`[QVAC] Procesando bloque intacto ${i + 1} de ${fragmentos.length}...`);

    // Prompt con técnica "Few-Shot" para domar al modelo 1B
    const history = [
        { role: "system", content: "Eres un liquidador de aduanas. Tu única función es extraer datos y devolverlos en formato JSON. Si no encuentras productos, devuelve un array vacío []." },
        {
            role: "user", content: `Extrae CÓDIGO, DESCRIPCIÓN, CANTIDAD y PRECIO de este texto. 
REGLA 1: Devuelve ESTRICTAMENTE el array [{}, {}].
REGLA 2: NO inventes datos. NO incluyas texto conversacional.
TEXTO:
${fragmentos[i]}`
        }
    ];

    const result = completion({ modelId, history, stream: true });
    let textoAcumulado = "";
    for await (const token of result.tokenStream) { textoAcumulado += token; }

    // Buscamos forzosamente cualquier bloque de texto que empiece con '[' y termine con ']'
    const arrayMatch = textoAcumulado.match(/\[[\s\S]*\]/);

    if (arrayMatch) {
        try {
            // Parseamos solo lo que está dentro de los corchetes, ignorando la "charla" de la IA
            const datosExtraidos = JSON.parse(arrayMatch[0]);
            facturaConsolidada.productos.push(...datosExtraidos);
        } catch (e) {
            console.error(`[ERROR] La IA omitió una coma o comilla en el bloque ${i + 1}.`);
        }
    } else {
        // Para casos donde la IA solo responde un objeto {} en vez de array []
        const objMatch = textoAcumulado.match(/\{[\s\S]*\}/);
        if (objMatch) {
            try {
                const dato = JSON.parse(objMatch[0]);
                facturaConsolidada.productos.push(dato);
            } catch (e) {
                console.error(`[ERROR] JSON roto en bloque ${i + 1}.`);
            }
        } else {
            console.error(`[ERROR] No se encontró estructura JSON en el bloque ${i + 1}.`);
        }
    }
} // Fin del for
await unloadModel({ modelId });
await close();

fs.writeFileSync('resultado_factura.json', JSON.stringify(facturaConsolidada, null, 2));
console.log(`\n✅ Prueba de estrés finalizada. Revisa el archivo 'resultado_factura.json' en tu carpeta.`);