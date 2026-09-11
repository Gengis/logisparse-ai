export async function POST(request) {
    try {
        const { mensaje, contexto } = await request.json();
        if (!mensaje) return Response.json({ error: "Mensaje vacío" }, { status: 400 });

        // =========================================================================
        // 1. ENTORNO VERCEL / SERVERLESS (Evita analizar o empaquetar @qvac/sdk)
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
        // 2. ENTORNO LOCAL / EDGE (Carga dinámica de QVAC SDK solo en servidor local)
        // =========================================================================
        let extracted = null;

        try {
            // Usar eval('require') evita que el empaquetador de Vercel/Next.js intente analizar @qvac/sdk en el build
            const qvacName = "@qvac/sdk";
            const qvac = eval("require")(qvacName);

            if (qvac && qvac.loadModel) {
                const modelId = await qvac.loadModel({
                    modelSrc: qvac.LLAMA_3_2_1B_INST_Q4_0,
                    modelType: "llm"
                });

                const history = [
                    { role: "system", content: "Extrae equipo, marca, antiguedad y ubicacion en formato JSON." },
                    { role: "user", content: mensaje }
                ];

                const result = qvac.completion({ modelId, history, stream: true, format: "json" });
                let acum = "";
                for await (const token of result.tokenStream) acum += token;
                await qvac.unloadModel({ modelId });

                const match = acum.match(/\{[\s\S]*\}/);
                if (match) extracted = JSON.parse(match[0]);
            }
        } catch (qvacError) {
            console.warn("[QVAC SDK Fallback]: Ejecutando con motor Edge local.");
        }

        // =========================================================================
        // 3. PROCESAMIENTO RESILIENTE DE ENTIDADES
        // =========================================================================
        const msg = mensaje.toLowerCase();
        let equipo = (extracted?.equipo && extracted.equipo !== "null") ? extracted.equipo : (contexto?.equipo !== "-" ? contexto?.equipo : null);
        let marca = (extracted?.marca && extracted.marca !== "null") ? extracted.marca : (contexto?.marca !== "-" ? contexto?.marca : null);
        let antiguedad = (extracted?.antiguedad && extracted.antiguedad !== "null") ? extracted.antiguedad : (contexto?.antiguedad !== "-" ? contexto?.antiguedad : null);
        let ubicacion = (extracted?.ubicacion && extracted.ubicacion !== "null") ? extracted.ubicacion : (contexto?.ubicacion !== "-" ? contexto?.ubicacion : null);

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
        if (!ubicacion) {
            if (msg.includes("radiologia") || msg.includes("radiología")) ubicacion = "Radiología";
            else if (msg.includes("urgencias")) ubicacion = "Urgencias";
        }

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