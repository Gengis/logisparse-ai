import Link from 'next/link';

// Simulamos la base de datos inyectando los registros del Dummy_Installed_Base_Hackathon.xlsx
const baseInstalada = [
    { id: 1, pais: "Panama", ciudad: "Panama City", cliente: "Hospital DemoCare Pacific", modalidad: "MR", cantidad: 2, marca: "NovaMed", modelo: "NM-MR 700", edad: 7, confianza: "High", estado: "Reportado" },
    { id: 2, pais: "Panama", ciudad: "Panama City", cliente: "Hospital DemoCare Pacific", modalidad: "CT", cantidad: 1, marca: "Aurelia Health", modelo: "AH-CT 320", edad: 5, confianza: "High", estado: "Reportado" },
    { id: 3, pais: "Brazil", ciudad: "Sao Paulo", cliente: "Hospital DemoCare Horizon", modalidad: "MR", cantidad: 3, marca: "BluePeak Medical", modelo: "BP-MR 500", edad: 9, confianza: "Medium", estado: "Estimado" },
    { id: 4, pais: "Mexico", ciudad: "Mexico City", cliente: "Clinica Salud Central", modalidad: "Ultrasound", cantidad: 5, marca: "NovaMed", modelo: "Echo-X", edad: 3, confianza: "High", estado: "Confirmado" },
];

export default function Dashboard360() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            {/* Cabecera */}
            <div className="max-w-6xl mx-auto mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-blue-900">Installed Base 360</h1>
                    <p className="text-gray-600">Panorama tecnológico validado por Sovereign Node</p>
                </div>
                <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
                    + Nueva Auditoría
                </Link>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* KPIs (Agregación) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Total Equipos Clínicos</h3>
                    <p className="text-4xl font-bold text-blue-900 mt-2">11</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Modalidades Activas</h3>
                    <div className="flex gap-4 mt-2">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">MR: 5</span>
                        <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-bold">CT: 1</span>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">US: 5</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Oportunidades de Renovación</h3>
                    <p className="text-4xl font-bold text-orange-600 mt-2">1 <span className="text-sm font-normal text-gray-500">(&gt; 8 años)</span></p>
                </div>
            </div>

            {/* Vista 360 por Cliente */}
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-blue-900 px-6 py-4">
                    <h2 className="text-white font-bold text-lg">Hospital DemoCare Pacific (Panama City)</h2>
                </div>
                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                                <th className="p-4 font-bold">Modalidad</th>
                                <th className="p-4 font-bold">Cantidad</th>
                                <th className="p-4 font-bold">Marca / Modelo</th>
                                <th className="p-4 font-bold">Antigüedad</th>
                                <th className="p-4 font-bold">Estado del Dato</th>
                            </tr>
                        </thead>
                        <tbody>
                            {baseInstalada.filter(eq => eq.cliente === "Hospital DemoCare Pacific").map((equipo) => (
                                <tr key={equipo.id} className="border-b border-gray-100 hover:bg-blue-50/50">
                                    <td className="p-4 font-bold text-blue-900">{equipo.modalidad}</td>
                                    <td className="p-4">{equipo.cantidad}</td>
                                    <td className="p-4">{equipo.marca} <span className="text-gray-400 text-sm block">{equipo.modelo}</span></td>
                                    <td className="p-4">{equipo.edad} años</td>
                                    <td className="p-4">
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
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