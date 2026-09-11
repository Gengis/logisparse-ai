'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';

export default function PhilipsMobileApp() {
    const [mensajes, setMensajes] = useState([{ rol: 'agente', texto: 'Sovereign Node Activo. ¿Qué equipo estás auditando hoy?' }]);
    const [input, setInput] = useState('');
    const [cargando, setCargando] = useState(false);
    const [datosEquipo, setDatosEquipo] = useState({ equipo: null, marca: null, antiguedad: null, estado: null });
    const [grabando, setGrabando] = useState(false);

    const recognitionRef = useRef(null);

    const iniciarDictado = () => {
        // Si ya está grabando, detenemos el micrófono manualmente
        if (grabando) {
            recognitionRef.current?.stop();
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return alert("Tu navegador no soporta dictado local.");

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'es-ES';

        // CAMBIOS CLAVE: Transcripción en vivo y control manual
        recognition.interimResults = true;
        recognition.continuous = true;

        recognition.onstart = () => {
            setGrabando(true);
            setInput(''); // Limpiamos el input al empezar a hablar
        };

        recognition.onresult = (e) => {
            // Concatenamos todo lo que va escuchando en tiempo real
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
                body: JSON.stringify({ mensaje: textoUsuario, contexto: datosEquipo }), // Inyectamos memoria
            });
            const data = await res.json();

            if (data.error) {
                setMensajes((prev) => [...prev, { rol: 'agente', texto: 'Error de decodificación. ¿Puedes reformularlo?' }]);
            } else {
                // Actualizamos el dashboard
                setDatosEquipo({
                    equipo: data.equipo || '-',
                    marca: data.marca || '-',
                    antiguedad: data.antiguedad || '-',
                    estado: data.estado || '-'
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
        <div className="min-h-screen bg-gray-900 flex justify-center items-center">
            {/* Contenedor tamaño celular */}
            <div className="w-full max-w-md h-screen bg-gray-50 flex flex-col shadow-2xl relative overflow-hidden">

                {/* Cabecera Móvil */}
                <div className="bg-blue-800 p-4 text-white flex justify-between items-start md:items-center gap-4 rounded-t-xl">
                    <div className="flex-1">
                        <h2 className="font-bold text-lg flex items-center gap-2">
                            <span className="bg-blue-500 p-1 rounded-full text-xs">SN</span> Sovereign Node
                        </h2>
                        <p className="text-xs text-blue-200 mt-1">Philips Field Agent • Encriptación Edge</p>
                    </div>

                    <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-500 text-xs px-3 py-2 rounded-lg font-bold transition-colors whitespace-nowrap shrink-0 mt-1 md:mt-0 shadow-sm border border-blue-700">
                        Dashboard 360
                    </Link>
                </div>

                {/* Dashboard de Datos (Tiempo Real) */}
                <div className="bg-gray-100 p-2 rounded"><b>Equipo:</b> <span className="text-blue-600">{datosEquipo.equipo || '-'}</span></div>
                <div className="bg-gray-100 p-2 rounded"><b>Marca:</b> <span className="text-blue-600">{datosEquipo.marca || '-'}</span></div>
                <div className="bg-gray-100 p-2 rounded"><b>Edad:</b> <span className="text-blue-600">{datosEquipo.antiguedad || '-'}</span></div>
                <div className="bg-gray-100 p-2 rounded"><b>Estado:</b> <span className="text-green-600 font-bold">{datosEquipo.estado || '-'}</span></div>

                {/* Chat Log */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {mensajes.map((msg, i) => (
                        <div key={i} className={`flex ${msg.rol === 'tecnico' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.rol === 'tecnico' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                                {msg.texto}
                            </div>
                        </div>
                    ))}
                    {cargando && (
                        <div className="flex justify-start">
                            <div className="bg-white border p-3 rounded-2xl rounded-bl-none text-xs text-gray-400">QVAC analizando...</div>
                        </div>
                    )}
                </div>

                {/* Input area con Audio */}
                <form onSubmit={enviarMensaje} className="bg-white p-3 border-t flex items-center gap-2">
                    <button
                        type="button"
                        onClick={iniciarDictado}
                        className={`rounded-full min-w-[40px] h-10 flex justify-center items-center font-bold transition-all shadow-sm border ${grabando ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        title="Dictar por voz"
                    >
                        {grabando ? '⏹' : '🎙️'}
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={grabando ? "Escuchando (habla ahora)..." : "Reporta el equipo hallado..."}
                        className={`flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${grabando ? 'bg-red-50 text-red-700 placeholder-red-400' : ''}`}
                        disabled={cargando}
                    />
                    <button type="submit" disabled={cargando || !input.trim()} className="bg-blue-600 disabled:bg-blue-300 text-white rounded-full min-w-[40px] h-10 flex justify-center items-center font-bold shadow-sm">
                        ➤
                    </button>
                </form>
            </div>
        </div>
    );
}