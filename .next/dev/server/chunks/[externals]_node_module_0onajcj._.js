module.exports = [
"[externals]/node:module [external] (node:module, cjs, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/[externals]_node_module_144_b5-._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[externals]/node:module [external] (node:module, cjs)");
    });
});
}),
];