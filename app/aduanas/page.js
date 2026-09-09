'use client';
import { useState } from 'react';

export default function AduanasPage() {
    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] = useState(null);

    const subirArchivo = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/extract-invoice', { method: 'POST', body: formData });
            const data = await res.json();
            setResultado(data);
        } catch (error) {
            alert('Error ejecutando el motor híbrido.');
        }
        setLoading(false);
    };
    // Convierte objetos anidados de QVAC en texto plano para que React no explote
    const textoSeguro = (valor) => {
        if (!valor) return 'N/A';
        if (typeof valor === 'object') return valor.nombre || valor.empresa || JSON.stringify(valor);
        return String(valor);
    };
    return (
        <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl w-full p-6 bg-white rounded-xl shadow-md border border-gray-200 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">LogisParse: Extracción Híbrida</h2>
                <div className="p-8 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50">
                    <input type="file" accept=".pdf, image/jpeg, image/png" onChange={subirArchivo} disabled={loading} className="w-full" />
                </div>
                {loading && <p className="mt-4 text-blue-600 font-bold">⚙️ Ejecutando Python + QVAC localmente...</p>}
                {resultado && (
                    <div className="mt-8 text-left w-full">
                        {/* Tarjetas de Metadatos */}
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <span className="text-xs text-blue-500 font-bold uppercase tracking-wider">Remitente</span>
                            <p className="font-semibold text-gray-800 mt-1">{textoSeguro(resultado.remitente_destinatario?.remitente)}</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <span className="text-xs text-blue-500 font-bold uppercase tracking-wider">Destinatario</span>
                            <p className="font-semibold text-gray-800 mt-1">{textoSeguro(resultado.remitente_destinatario?.destinatario)}</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <span className="text-xs text-blue-500 font-bold uppercase tracking-wider">Incoterm</span>
                            <p className="font-semibold text-gray-800 mt-1">{textoSeguro(resultado.remitente_destinatario?.incoterm)}</p>
                        </div>

                        {/* Tabla de Mercancía */}
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full text-sm text-left text-gray-600">
                                <thead className="bg-gray-100 text-gray-700 font-semibold uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-3 border-b">Código</th>
                                        <th className="px-4 py-3 border-b">Descripción</th>
                                        <th className="px-4 py-3 border-b">Origen</th>
                                        <th className="px-4 py-3 border-b text-right">Cant.</th>
                                        <th className="px-4 py-3 border-b text-right">Total ($)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {resultado.productos?.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 font-mono text-xs">{item.codigo}</td>
                                            <td className="px-4 py-2 truncate max-w-xs" title={item.descripcion}>{item.descripcion}</td>
                                            <td className="px-4 py-2">{item.origen}</td>
                                            <td className="px-4 py-2 text-right">{item.cantidad}</td>
                                            <td className="px-4 py-2 text-right font-medium text-gray-900">{item.p_total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-gray-400 mt-4 text-center">Datos extraídos localmente sin conexión a la nube.</p>
                    </div>
                )}
            </div>
        </main>
    );
}