module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/app/api/philips-insight/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__ = __turbopack_context__.i("[externals]/@qvac/sdk [external] (@qvac/sdk, esm_import, [project]/node_modules/@qvac/sdk)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
async function POST(request) {
    if (process.env.VERCEL) {
        return Response.json({
            equipo: "Tomógrafo",
            marca: "Aurelia Health",
            antiguedad: "5 años",
            estado: "Reportado",
            pregunta_seguimiento: null
        });
    }
    try {
        const { mensaje, contexto } = await request.json();
        if (!mensaje) return Response.json({
            error: "Mensaje vacío"
        }, {
            status: 400
        });
        const modelId = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__["loadModel"])({
            modelSrc: __TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__["LLAMA_3_2_1B_INST_Q4_0"],
            modelType: "llm"
        });
        // PROMPT AISLADO: La IA solo mira el mensaje actual. Si no hay dato, obligamos a null.
        const history = [
            {
                role: "system",
                content: `Eres un extractor JSON. Analiza SOLO la oración del usuario.
REGLAS:
1. Extrae "equipo", "marca" y "antiguedad".
2. Si un dato NO se menciona en esta oración exacta, su valor DEBE ser null.
3. Convierte números escritos a dígitos (ej. "cinco" a "5").
4. DEVUELVE SOLO UN JSON. Sin texto adicional.`
            },
            {
                role: "user",
                content: mensaje
            }
        ];
        const result = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__["completion"])({
            modelId,
            history,
            stream: true,
            format: "json"
        });
        let textoAcumulado = "";
        for await (const token of result.tokenStream)textoAcumulado += token;
        await (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__["unloadModel"])({
            modelId
        });
        // 1. Limpiamos el contexto anterior (convertimos guiones a null para evaluar mejor)
        let parsed = {
            equipo: contexto.equipo && contexto.equipo !== "-" ? contexto.equipo : null,
            marca: contexto.marca && contexto.marca !== "-" ? contexto.marca : null,
            antiguedad: contexto.antiguedad && contexto.antiguedad !== "-" ? contexto.antiguedad : null,
            estado: "Reportado"
        };
        // 2. Extraemos lo nuevo y actualizamos SOLO si la IA encontró un valor real
        const jsonMatch = textoAcumulado.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const extracted = JSON.parse(jsonMatch[0]);
                if (extracted.equipo && extracted.equipo !== "null") parsed.equipo = extracted.equipo;
                if (extracted.marca && extracted.marca !== "null") parsed.marca = extracted.marca;
                if (extracted.antiguedad && extracted.antiguedad !== "null") parsed.antiguedad = extracted.antiguedad;
            } catch (e) {}
        }
        // SALVAVIDAS HACKATHON: Si la IA puso la marca en el campo del equipo por error, lo revertimos
        if (parsed.equipo === parsed.marca && contexto.equipo && contexto.equipo !== "-") {
            parsed.equipo = contexto.equipo;
        }
        // 3. Lógica Determinista de Preguntas
        const faltaEquipo = !parsed.equipo;
        const faltaMarca = !parsed.marca;
        const faltaEdad = !parsed.antiguedad;
        // Evitamos que pregunte por "tomadoongas" si hubo un error tipográfico
        const nombreEquipo = parsed.equipo || "equipo";
        if (faltaEquipo) {
            parsed.pregunta_seguimiento = "¿Qué tipo de equipo clínico estás auditando hoy?";
        } else if (faltaMarca && faltaEdad) {
            parsed.pregunta_seguimiento = `¿Pudiste identificar la marca y la antigüedad del ${nombreEquipo}?`;
        } else if (faltaMarca) {
            parsed.pregunta_seguimiento = `¿Lograste ver de qué marca es el ${nombreEquipo}?`;
        } else if (faltaEdad) {
            parsed.pregunta_seguimiento = `¿Cuál es la antigüedad aproximada del ${nombreEquipo}?`;
        } else {
            parsed.pregunta_seguimiento = null; // Reporte completo
        }
        // 4. Devolvemos los guiones al frontend para que no se vea vacío
        parsed.equipo = parsed.equipo || "-";
        parsed.marca = parsed.marca || "-";
        parsed.antiguedad = parsed.antiguedad || "-";
        return Response.json(parsed);
    } catch (error) {
        return Response.json({
            error: "Fallo del motor"
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1b7ukdg._.js.map