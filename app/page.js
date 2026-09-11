'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';

export default function PhilipsMobileApp() {
    const [mensajes, setMensajes] = useState([{ rol: 'agente', texto: 'Sovereign Node Activo. ¿Qué equipo estás auditando hoy?' }]);
    const [input, setInput] = useState('');
    const [cargando, setCargando] = useState(false);

    // Mantenemos null/vacío para que QVAC identifique que los campos están limpios
    const [datosEquipo, setDatosEquipo] = useState({ equipo: null, marca: null, antiguedad: null, ubicacion: null, estado: null });
    const [grabando, setGrabando] = useState(false);

    const recognitionRef = useRef(null);

    const iniciarDictado = () => {
        if (grabando) {
            recognitionRef.current?.stop();
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return alert("Tu navegador no soporta dictado local.");

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'es-ES';

        recognition.interimResults = true;
        recognition.continuous = true;

        recognition.onstart = () => {
            setGrabando(true);
            setInput('');
        };

        recognition.onresult = (e) => {
            const textoActual = Array.from(e.results)
                .map(resultado => resultado[0].transcript)
                .join('');
            setInput(textoActual);
        };

        recognition.onerror = (e) => {
            if (e.error !== 'aborted') {
                console.warn("Aviso de micrófono:", e.error);
            }
            setGrabando(false);
        };

        recognition.onend = () => setGrabando(false);

        recognition.start();
    };

    const enviarMensaje = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const textoUsuario = input;
        setMensajes((prev) => [...prev, { rol: 'tecnico', texto: textoUsuario }]);
        setInput('');
        setCargando(true);

        try {
            const res = await fetch('/api/philips-insight', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mensaje: textoUsuario, contexto: datosEquipo }),
            });
            const data = await res.json();

            if (data.error) {
                setMensajes((prev) => [...prev, { rol: 'agente', texto: 'Error de decodificación. ¿Puedes reformularlo?' }]);
            } else {
                setDatosEquipo({
                    equipo: data.equipo && data.equipo !== '-' ? data.equipo : null,
                    marca: data.marca && data.marca !== '-' ? data.marca : null,
                    antiguedad: data.antiguedad && data.antiguedad !== '-' ? data.antiguedad : null,
                    ubicacion: data.ubicacion && data.ubicacion !== '-' ? data.ubicacion : null,
                    estado: data.estado && data.estado !== '-' ? data.estado : null
                });

                const respuestaAgente = data.pregunta_seguimiento
                    ? data.pregunta_seguimiento
                    : '¡Reporte completado y encriptado exitosamente!';

                setMensajes((prev) => [...prev, { rol: 'agente', texto: respuestaAgente }]);
            }
        } catch (error) {
            setMensajes((prev) => [...prev, { rol: 'agente', texto: 'Error de conexión con el nodo.' }]);
        }
        setCargando(false);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex justify-center items-center p-2 md:p-4">
            {/* Frame de dispositivo móvil */}
            <div className="w-full max-w-md h-[92vh] max-h-[800px] bg-white flex flex-col rounded-3xl shadow-2xl relative overflow-hidden border border-slate-700">

                {/* Cabecera Móvil Estilizada */}
                <div className="bg-blue-900 p-4 text-white flex justify-between items-center gap-3 shrink-0 border-b border-blue-800">
                    <div className="flex-1">
                        <h2 className="font-bold text-base flex items-center gap-2">
                            <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-black tracking-wider">SN</span>
                            Sovereign Node
                        </h2>
                        <p className="text-[11px] text-blue-200 mt-0.5">Philips Field Agent • Encriptación Edge</p>
                    </div>

                    <Link
                        href="/dashboard"
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 border border-blue-400 shadow-sm active:scale-95"
                    >
                        Dashboard 360
                    </Link>
                </div>

                {/* Grid Ficha Técnica (Reestructurada de 2x2) */}
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-700 shrink-0 shadow-inner">
                    <div className="truncate">
                        <span className="font-bold text-slate-900">Equipo:</span>{' '}
                        <span className="text-blue-700 font-semibold">{datosEquipo.equipo || '—'}</span>
                    </div>
                    <div className="truncate">
                        <span className="font-bold text-slate-900">Marca:</span>{' '}
                        <span className="text-blue-700 font-semibold">{datosEquipo.marca || '—'}</span>
                    </div>
                    <div className="truncate">
                        <span className="font-bold text-slate-900">Edad:</span>{' '}
                        <span className="text-blue-700 font-semibold">{datosEquipo.antiguedad || '—'}</span>
                    </div>
                    <div className="truncate">
                        <span className="font-bold text-slate-900">Ubicación:</span>{' '}
                        <span className="text-blue-700 font-semibold">{datosEquipo.ubicacion || '—'}</span>
                    </div>
                    <div className="truncate">
                        <span className="font-bold text-slate-900">Estado:</span>{' '}
                        <span className="text-emerald-600 font-semibold">{datosEquipo.estado || '—'}</span>
                    </div>
                </div>

                {/* Chat Log */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                    {mensajes.map((msg, i) => (
                        <div key={i} className={`flex ${msg.rol === 'tecnico' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${msg.rol === 'tecnico'
                                ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                                }`}>
                                {msg.texto}
                            </div>
                        </div>
                    ))}
                    {cargando && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none text-xs text-slate-400 animate-pulse shadow-sm">
                                QVAC analizando en el borde...
                            </div>
                        </div>
                    )}
                </div>

                {/* Input area con dictado táctil */}
                <form onSubmit={enviarMensaje} className="bg-white p-3 border-t border-slate-200 flex items-center gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={iniciarDictado}
                        className={`rounded-full w-9 h-9 flex justify-center items-center text-sm font-bold transition-all shrink-0 border ${grabando
                            ? 'bg-red-500 text-white animate-pulse border-red-600'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-300'
                            }`}
                        title="Dictar por voz"
                    >
                        {grabando ? '⏹' : '🎙️'}
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={grabando ? "Escuchando voz..." : "Reporta el equipo hallado..."}
                        className={`flex-1 border rounded-full px-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${grabando ? 'bg-red-50 text-red-700 placeholder-red-400 border-red-300' : 'bg-slate-100 border-slate-200'
                            }`}
                        disabled={cargando}
                    />
                    <button
                        type="submit"
                        disabled={cargando || !input.trim()}
                        className="bg-blue-600 disabled:bg-blue-300 text-white rounded-full w-9 h-9 flex justify-center items-center font-bold text-xs shrink-0 shadow-md transition-transform active:scale-95"
                    >
                        ➤
                    </button>
                </form>
            </div>
        </div>
    );
}