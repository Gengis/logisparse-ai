import { completion, LLAMA_3_2_1B_INST_Q4_0, loadModel, unloadModel, close } from "@qvac/sdk";

export async function POST(request) {
    try {
        const body = await request.json();
        const { texto } = body;

        if (!texto) {
            return Response.json({ error: "Falta el texto de la observación" }, { status: 400 });
        }

        console.log("[SYS] Iniciando motor QVAC para Philips Insight...");

        // 1. Cargar el modelo en el dispositivo (Cero Nube)
        const modelId = await loadModel({ modelSrc: LLAMA_3_2_1B_INST_Q4_0, modelType: "llm" });

        // 2. Prompt diseñado específicamente para modelos 1B (Control de Alucinaciones)
        const history = [
            {
                role: "system",
                content: "Eres un asistente de datos de Philips. Extrae la información médica del texto. Devuelve ESTRICTAMENTE un JSON. Si falta un dato, escribe 'Desconocido'."
            },
            {
                role: "user",
                content: `Extrae CÓDIGO JSON. 
REGLAS: "estado_observacion" debe ser "Confirmado", "Reportado", "Estimado" o "Desconocido".
FORMATO ESPERADO:
{
  "cliente": "Nombre",
  "ciudad": "Ciudad",
  "pais": "País",
  "equipos": [{"modalidad": "Ej: CT", "cantidad": 0, "marca": "Marca", "antiguedad_estimada": "Ej: 8 años"}],
  "estado_observacion": "Estimado"
}

TEXTO DEL INGENIERO:
"${texto}"`
            }
        ];

        // 3. Inferencia Local
        const result = completion({ modelId, history, stream: true });

        let textoAcumulado = "";
        for await (const token of result.tokenStream) {
            textoAcumulado += token;
            process.stdout.write(token); // Para que veas en la terminal qué está pensando
        }

        // 4. Apagado seguro de memoria
        await unloadModel({ modelId });
        await close();

        // 5. Filtro Regex para ignorar texto conversacional extra que genere LLaMA
        const jsonMatch = textoAcumulado.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("El modelo no devolvió un JSON válido.");
        }

        const datosExtraidos = JSON.parse(jsonMatch[0]);

        return Response.json({ status: "success", data: datosExtraidos });

    } catch (error) {
        console.error("[ERROR QVAC]", error);
        // Intentamos apagar el modelo por si falló a mitad de camino
        try { await close(); } catch (e) { }
        return Response.json({ error: "Fallo en la inferencia local" }, { status: 500 });
    }
}