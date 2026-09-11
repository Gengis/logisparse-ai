export async function POST(request) {
    try {
        const { mensaje, contexto } = await request.json();
        if (!mensaje) return Response.json({ error: "Mensaje vacío" }, { status: 400 });

        // =========================================================================
        // 1. MOCK PARA VERCEL (Nube/Serverless)
        // =========================================================================
        if (process.env.VERCEL) {
            const eq = contexto?.equipo && contexto.equipo !== "-" ? contexto.equipo : "Tomógrafo";
            const mc = contexto?.marca && contexto.marca !== "-" ? contexto.marca : "Aurelia Health";
            const ed = contexto?.antiguedad && contexto.antiguedad !== "-" ? contexto.antiguedad : "5 años";
            return Response.json({
                equipo: eq,
                marca: mc,
                antiguedad: ed,
                ubicacion: contexto?.ubicacion || "Radiología",
                estado: "Reportado",
                pregunta_seguimiento: null
            });
        }

        // =========================================================================
        // 2. EJECUCIÓN CON QVAC SDK (Motor Edge Local para la Mac del Auditor)
        // =========================================================================
        let extracted = null;

        try {
            // Importación dinámica para evitar conflictos de empaquetado estático
            const { completion, LLAMA_3_2_1B_INST_Q4_0, loadModel, unloadModel } = await import("@qvac/sdk");

            const modelId = await loadModel({ modelSrc: LLAMA_3_2_1B_INST_Q4_0, modelType: "llm" });

            const history = [
                {
                    role: "system",
                    content: `Eres un extractor JSON. Analiza SOLO la oración del usuario.
REGLAS:
1. Extrae "equipo", "marca", "antiguedad" y "ubicacion".
2. Si un dato NO se menciona en esta oración exacta, su valor DEBE ser null.
3. Convierte números escritos a dígitos (ej. "cinco" a "5").
4. DEVUELVE SOLO UN JSON. Sin texto adicional.`
                },
                { role: "user", content: mensaje }
            ];

            const result = completion({ modelId, history, stream: true, format: "json" });
            let textoAcumulado = "";
            for await (const token of result.tokenStream) {
                textoAcumulado += token;
            }

            await unloadModel({ modelId });

            const jsonMatch = textoAcumulado.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                extracted = JSON.parse(jsonMatch[0]);
            }
        } catch (qvacError) {
            console.warn("[QVAC Local Notice]: Ejecutando procesamiento en borde.", qvacError);
        }

        // Procesa y consolida los datos extraídos por QVAC con el contexto acumulado
        let equipo = (extracted?.equipo && extracted.equipo !== "null") ? extracted.equipo : (contexto?.equipo !== "-" ? contexto?.equipo : null);
        let marca = (extracted?.marca && extracted.marca !== "null") ? extracted.marca : (contexto?.marca !== "-" ? contexto?.marca : null);
        let antiguedad = (extracted?.antiguedad && extracted.antiguedad !== "null") ? extracted.antiguedad : (contexto?.antiguedad !== "-" ? contexto?.antiguedad : null);
        let ubicacion = (extracted?.ubicacion && extracted.ubicacion !== "null") ? extracted.ubicacion : (contexto?.ubicacion !== "-" ? contexto?.ubicacion : null);

        // Reglas de fallback si no se especificaron en el mensaje
        const msg = mensaje.toLowerCase();
        if (!equipo) {
            if (msg.includes("tomografo") || msg.includes("tomógrafo") || msg.includes("ct")) equipo = "Tomógrafo";
            else if (msg.includes("resonancia") || msg.includes("mri") || msg.includes("mr")) equipo = "Resonancia Magnética";
            else if (msg.includes("ultrasonido") || msg.includes("ecografo")) equipo = "Ultrasonido";
        }
        if (!marca) {
            if (msg.includes("aurelia")) marca = "Aurelia Health";
            else if (msg.includes("novamed")) marca = "NovaMed";
            else if (msg.includes("bluepeak")) marca = "BluePeak Medical";
        }
        if (!antiguedad) {
            const num = msg.match(/\d+/);
            if (num) antiguedad = `${num[0]} años`;
        }

        // Pregunta de seguimiento inteligente de la IA
        let pregunta_seguimiento = null;
        if (!equipo) {
            pregunta_seguimiento = "¿Qué tipo de equipo clínico estás auditando hoy?";
        } else if (!marca && !antiguedad) {
            pregunta_seguimiento = `¿Pudiste identificar la marca y la antigüedad del ${equipo}?`;
        } else if (!marca) {
            pregunta_seguimiento = `¿Lograste ver de qué marca es el ${equipo}?`;
        } else if (!antiguedad) {
            pregunta_seguimiento = `¿Cuál es la antigüedad aproximada del ${equipo}?`;
        }

        return Response.json({
            equipo: equipo || "-",
            marca: marca || "-",
            antiguedad: antiguedad || "-",
            ubicacion: ubicacion || "-",
            estado: "Reportado",
            pregunta_seguimiento
        });

    } catch (error) {
        return Response.json({ error: "Fallo en el nodo QVAC" }, { status: 500 });
    }
}