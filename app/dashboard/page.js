import Link from 'next/link';

const baseInstalada = [
    { id: 1, pais: "Panama", ciudad: "Panama City", cliente: "Hospital DemoCare Pacific", modalidad: "MR", cantidad: 2, marca: "NovaMed", modelo: "NM-MR 700", edad: 7, confianza: "High", estado: "Reportado" },
    { id: 2, pais: "Panama", ciudad: "Panama City", cliente: "Hospital DemoCare Pacific", modalidad: "CT", cantidad: 1, marca: "Aurelia Health", modelo: "AH-CT 320", edad: 5, confianza: "High", estado: "Reportado" },
    { id: 3, pais: "Brazil", ciudad: "Sao Paulo", cliente: "Hospital DemoCare Horizon", modalidad: "MR", cantidad: 3, marca: "BluePeak Medical", modelo: "BP-MR 500", edad: 9, confianza: "Medium", estado: "Estimado" },
    { id: 4, pais: "Mexico", ciudad: "Mexico City", cliente: "Clinica Salud Central", modalidad: "Ultrasound", cantidad: 5, marca: "NovaMed", modelo: "Echo-X", edad: 3, confianza: "High", estado: "Confirmado" },
];

export default function Dashboard360() {
    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
            {/* Cabecera */}
            <div className="max-w-6xl mx-auto mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Installed Base 360</h1>
                    <p className="text-slate-600 text-sm mt-1">Panorama tecnológico validado por Sovereign Node</p>
                </div>
                <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-md transition-all">
                    + Nueva Auditoría
                </Link>
            </div>

            {/* Tarjetas KPI */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Equipos Clínicos</h3>
                    <p className="text-4xl font-extrabold text-blue-900 mt-2">11</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Modalidades Activas</h3>
                    <div className="flex gap-2 mt-3">
                        <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">MR: 5</span>
                        <span className="bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">CT: 1</span>
                        <span className="bg-purple-100 text-purple-900 px-3 py-1 rounded-full text-xs font-bold border border-purple-200">US: 5</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Oportunidades de Renovación</h3>
                    <p className="text-4xl font-extrabold text-amber-600 mt-2">1 <span className="text-xs font-semibold text-slate-500">(&gt; 8 años)</span></p>
                </div>
            </div>

            {/* Tabla de Base Instalada */}
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-blue-900 px-6 py-4">
                    <h2 className="text-white font-bold text-base">Hospital DemoCare Pacific (Panama City)</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="p-4">Modalidad</th>
                                <th className="p-4">Cantidad</th>
                                <th className="p-4">Marca / Modelo</th>
                                <th className="p-4">Antigüedad</th>
                                <th className="p-4">Estado del Dato</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {baseInstalada.filter(eq => eq.cliente === "Hospital DemoCare Pacific").map((equipo) => (
                                <tr key={equipo.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="p-4 font-extrabold text-blue-900 text-sm">{equipo.modalidad}</td>
                                    <td className="p-4 font-bold text-slate-800 text-sm">{equipo.cantidad}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-900 text-sm">{equipo.marca}</div>
                                        <div className="text-xs font-semibold text-slate-600 mt-0.5">{equipo.modelo}</div>
                                    </td>
                                    <td className="p-4 font-bold text-slate-800 text-sm">{equipo.edad} años</td>
                                    <td className="p-4">
                                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-block">
                                            {equipo.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}