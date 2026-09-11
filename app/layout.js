import './globals.css'; // Opcional, si tienes estilos globales configurados

export const metadata = {
    title: 'IA Soberana - Hackathon',
    description: 'Procesamiento local seguro sin la nube',
    manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body className="bg-gray-100">
                {children}
            </body>
        </html>
    );
}