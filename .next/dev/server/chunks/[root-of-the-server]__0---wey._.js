module.exports = [
"[externals]/fs/promises [external] (fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("fs/promises", () => require("fs/promises"));

module.exports = mod;
}),
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
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/app/api/extract-invoice/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs/promises [external] (fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$pdf$2d$extraction__$5b$external$5d$__$28$pdf$2d$extraction$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$pdf$2d$extraction$29$__ = __turbopack_context__.i("[externals]/pdf-extraction [external] (pdf-extraction, cjs, [project]/node_modules/pdf-extraction)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__ = __turbopack_context__.i("[externals]/@qvac/sdk [external] (@qvac/sdk, esm_import, [project]/node_modules/@qvac/sdk)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
async function POST(request) {
    try {
        const data = await request.formData();
        const file = data.get('file');
        if (!file) return Response.json({
            error: "Missing file payload"
        }, {
            status: 400
        });
        const buffer = Buffer.from(await file.arrayBuffer());
        // 1. Extracción limpia de texto
        const pdfData = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$pdf$2d$extraction__$5b$external$5d$__$28$pdf$2d$extraction$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$pdf$2d$extraction$29$__["default"])(buffer);
        const textoLimpio = pdfData.text.replace(/\s+/g, ' ');
        // Truncamos inteligente: inicio (empresas) + final (totales e incoterms)
        const textoParaIA = textoLimpio.substring(0, 2500) + "\n...\n" + textoLimpio.slice(-1500);
        // 2. Extracción Cognitiva con QVAC (Cero dependencias de Python)
        const modelId = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__["loadModel"])({
            modelSrc: __TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__["LLAMA_3_2_1B_INST_Q4_0"],
            modelType: "llm"
        });
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
            {
                role: "user",
                content: `TEXTO DE LA FACTURA:\n${textoParaIA}`
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
        await (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__["close"])();
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
        try {
            await (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__["close"])();
        } catch (e) {}
        return Response.json({
            error: "Fallo en el procesamiento local de la factura"
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0---wey._.js.map