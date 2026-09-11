'use client';
import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function AduanasPage() {
    const [loading, setLoading] = useState(false);
    const [completado, setCompletado] = useState(false);
    const [csvBlob, setCsvBlob] = useState(null);
    const [nombreArchivo, setNombreArchivo] = useState('');
    const [mensajeError, setMensajeError] = useState(null);

    const subirArchivo = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setCompletado(false);
        setMensajeError(null);
        setNombreArchivo(file.name.replace(/\.[^/.]+$/, ""));

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/extract-invoice', { 
                method: 'POST', 
                body: formData 
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: 'Error procesando el archivo' }));
                throw new Error(errorData.error || 'Error al procesar la factura.');
            }

            const blob = await res.blob();
            setCsvBlob(blob);
            setCompletado(true);

        } catch (error) {
            setMensajeError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const descargarComoCSV = () => {
        if (!csvBlob) return;
        descargarBlob(csvBlob, `${nombreArchivo}_bd.csv`);
    };

    const descargarComoExcel = async () => {
        if (!csvBlob) return;
        
        const textoCsv = await csvBlob.text();
        const workbook = XLSX.read(textoCsv, { type: 'string', raw: true });
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const excelBlob = new Blob([excelBuffer], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });

        descargarBlob(excelBlob, `${nombreArchivo}_bd.xlsx`);
    };

    const descargarBlob = (blob, fileName) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    const reiniciar = () => {
        setCompletado(false);
        setCsvBlob(null);
        setNombreArchivo('');
        setMensajeError(null);
    };

    return (
        <main 
            style={{ 
                background: '#ecfeff', // Celeste puro y claro (cyan-50)
                minHeight: '100vh', 
                width: '100%', 
                display: 'grid', 
                placeItems: 'center', 
                padding: '1.5rem 1rem',
                boxSizing: 'border-box'
            }}
        >
            <div className="max-w-xl w-full space-y-4">
                
                {/* TARJETA DE INTRODUCCIÓN */}
                <div className="bg-white rounded-xl shadow-md border border-cyan-100 p-5 text-center text-slate-800">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-100 text-cyan-600 mb-2 border border-cyan-200 shadow-sm">
                        ⚡
                    </div>
                    <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
                        LogisParse: Extracción Híbrida
                    </h2>
                    <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                        Procesamiento local seguro de documentos de aduana.
                    </p>
                </div>

                {/* TARJETA DE ACCIONES */}
                <div className="bg-white rounded-xl shadow-md border border-cyan-100 p-5 md:p-6 text-slate-800">
                    
                    {/* PASO 1: ZONA DE CARGA */}
                    {!completado && !loading && (
                        <div className="relative border-2 border-dashed border-cyan-300 hover:border-cyan-500 transition-colors duration-200 rounded-lg p-6 bg-cyan-50/60 text-center cursor-pointer group">
                            <input 
                                type="file" 
                                accept=".pdf, image/jpeg, image/png" 
                                onClick={(e) => { e.currentTarget.value = ''; }}
                                onChange={subirArchivo} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                            />
                            <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
                                <div className="p-2 bg-white rounded-full border border-cyan-200 shadow-sm group-hover:scale-105 transition-transform">
                                    📤
                                </div>
                                <p className="text-xs md:text-sm font-medium text-slate-700">
                                    Arrastra tu factura o <span className="text-cyan-600 font-semibold underline">haz clic para buscar</span>
                                </p>
                                <p className="text-[11px] text-slate-400">Soporta PDF, PNG y JPG</p>
                            </div>
                        </div>
                    )}

                    {/* ESTADO DE CARGA */}
                    {loading && (
                        <div className="p-6 rounded-lg bg-cyan-50 border border-cyan-200 text-center space-y-2">
                            <span className="animate-spin text-2xl inline-block text-cyan-600">⚙️</span>
                            <p className="text-xs text-cyan-700 font-bold">Procesando factura localmente...</p>
                            <p className="text-[11px] text-slate-500 truncate max-w-[250px] mx-auto">{nombreArchivo}</p>
                        </div>
                    )}

                    {/* PASO 2: BOTONES DE DESCARGA */}
                    {completado && (
                        <div className="text-center space-y-4">
                            <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-lg text-cyan-800 text-xs font-semibold">
                                ✅ Factura procesada correctamente
                            </div>

                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Selecciona el formato de descarga
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={descargarComoExcel}
                                    className="py-2.5 px-3 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition-all flex items-center justify-center space-x-2"
                                >
                                    <span>📊</span>
                                    <span>Descargar Excel</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={descargarComoCSV}
                                    className="py-2.5 px-3 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-600 text-white shadow-sm transition-all flex items-center justify-center space-x-2"
                                >
                                    <span>📄</span>
                                    <span>Descargar CSV</span>
                                </button>
                            </div>

                            <div className="pt-2 border-t border-slate-100">
                                <button
                                    onClick={reiniciar}
                                    className="text-xs text-cyan-600 font-semibold hover:underline"
                                >
                                    ← Procesar otra factura
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ERRORES */}
                    {mensajeError && (
                        <div className="mt-4 p-3 rounded-lg border bg-rose-50 border-rose-200 text-rose-700 text-center text-xs font-medium">
                            ❌ {mensajeError}
                        </div>
                    )}

                </div>
            </div>
        </main>
    );
}