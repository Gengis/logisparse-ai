'use client';
import { useState } from 'react';

export default function Page() {
    const [observacion, setObservacion] = useState('');
    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] = useState(null);

    const enviarObservacion = async () => {
        if (!observacion) return;
        setLoading(true);
        try {
            const res = await fetch('/api/philips-insight', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto: observacion })
            });
            const data = await res.json();
            setResultado(data);
        } catch (error) {
            alert("Error en la extracción soberana.");
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full p-6 bg-white rounded-xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Captura de Base Instalada (Philips)</h2>
                <textarea
                    className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
                    rows="4"
                    placeholder="Ej: Estoy en Hospital DemoCare... Tienen dos resonadores..."
                    value={observacion}
                    onChange={(e) => setObservacion(e.target.value)}
                ></textarea>

                <div className="flex justify-between items-center mt-4">
                    <button className="flex items-center text-gray-500 hover:text-blue-600 transition">
                        🎙️ Dictado por voz
                    </button>
                    <button
                        onClick={enviarObservacion}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? '🧠 Procesando en dispositivo...' : 'Extraer Datos'}
                    </button>
                </div>

                {resultado && (
                    <div className="mt-6 p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm">
                        <pre>{JSON.stringify(resultado, null, 2)}</pre>
                    </div>
                )}
            </div>
        </main>
    );
}