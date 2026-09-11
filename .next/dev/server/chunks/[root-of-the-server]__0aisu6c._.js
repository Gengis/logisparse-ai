module.exports = [
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
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
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[project]/app/api/extract-invoice/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/child_process [external] (child_process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$util__$5b$external$5d$__$28$util$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/util [external] (util, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs/promises [external] (fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$pdf$2d$extraction__$5b$external$5d$__$28$pdf$2d$extraction$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$pdf$2d$extraction$29$__ = __turbopack_context__.i("[externals]/pdf-extraction [external] (pdf-extraction, cjs, [project]/node_modules/pdf-extraction)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$csvtojson$2f$v2$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/csvtojson/v2/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__ = __turbopack_context__.i("[externals]/@qvac/sdk [external] (@qvac/sdk, esm_import, [project]/node_modules/@qvac/sdk)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
const execPromise = __TURBOPACK__imported__module__$5b$externals$5d2f$util__$5b$external$5d$__$28$util$2c$__cjs$29$__["default"].promisify(__TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__["exec"]);
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
        const tempPdfPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'temp_factura.pdf');
        const outDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'output');
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].mkdir(outDir, {
            recursive: true
        });
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].writeFile(tempPdfPath, buffer);
        // 1. Extracción de texto y truncamiento inteligente
        const pdfData = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$pdf$2d$extraction__$5b$external$5d$__$28$pdf$2d$extraction$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$pdf$2d$extraction$29$__["default"])(buffer);
        // CORTAMOS: Primeros 2000 caracteres (Página 1) + Últimos 1000 caracteres (Página final)
        // Esto captura la cabecera y el pie de página (Incoterm) sin saturar a QVAC con los productos.
        const textoParaIA = pdfData.text.substring(0, 2000) + "\n...\n" + pdfData.text.slice(-1000);
        // 2. Detección dinámica del ejecutable de Python según el sistema operativo
        const getPythonCommand = ()=>{
            if (process.env.PYTHON_PATH) return process.env.PYTHON_PATH;
            return ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'python3';
        };
        const pythonCommand = getPythonCommand();
        // 3. Ejecución paralela: Python maneja la tabla masiva y QVAC deduce entidades
        const [pythonResult, qvacResult] = await Promise.all([
            execPromise(`${pythonCommand} procesar_factura.py ${tempPdfPath} ${outDir}`),
            (async ()=>{
                const modelId = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__["loadModel"])({
                    modelSrc: __TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__["LLAMA_3_2_1B_INST_Q4_0"],
                    modelType: "llm"
                });
                const history = [
                    {
                        role: "system",
                        content: "Eres un liquidador de aduanas. Extrae la empresa Remitente, empresa Destinataria y el Incoterm. Devuelve ÚNICAMENTE un JSON."
                    },
                    {
                        role: "user",
                        content: `Analiza el encabezado.\nREGLAS ESTRICTAS:\n1. No uses nombres de cosméticos o perfumes.\n2. Busca entidades legales (S.A., Corp, LLC).\n3. Si no encuentras, usa "Desconocido".\n4. Los valores deben ser strings, no objetos.\n\nTEXTO:\n${textoParaIA}\n\nFORMATO:\n{"remitente": "", "destinatario": "", "incoterm": ""}`
                    }
                ];
                const result = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__["completion"])({
                    modelId,
                    history,
                    stream: true
                });
                let textoAcumulado = "";
                for await (const token of result.tokenStream)textoAcumulado += token;
                await (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__["unloadModel"])({
                    modelId
                });
                const jsonMatch = textoAcumulado.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    try {
                        return JSON.parse(jsonMatch[0]);
                    } catch (e) {
                        console.warn("[WARN] JSON parse failed on QVAC output");
                        return {
                            remitente: "Revisión manual",
                            destinatario: "Revisión manual",
                            incoterm: "Desconocido"
                        };
                    }
                }
                return {
                    remitente: "Desconocido",
                    destinatario: "Desconocido",
                    incoterm: "Desconocido"
                };
            })()
        ]);
        const csvFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(outDir, 'factura_items.csv');
        const jsonProductos = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$csvtojson$2f$v2$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])().fromFile(csvFilePath);
        await (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__["close"])();
        return Response.json({
            status: "success",
            remitente_destinatario: qvacResult,
            productos: jsonProductos
        });
    } catch (error) {
        console.error("[ERR_HYBRID_ENGINE]", error);
        try {
            await (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$qvac$2f$sdk__$5b$external$5d$__$2840$qvac$2f$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$qvac$2f$sdk$29$__["close"])();
        } catch (e) {}
        return Response.json({
            error: "Pipeline failure"
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0aisu6c._.js.map