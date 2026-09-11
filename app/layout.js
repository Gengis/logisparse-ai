import './globals.css';

export const metadata = {
    title: 'LogisParse-AI & Sovereign Node',
    description: 'Edge AI Field Agent',
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <head>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body className="bg-slate-900 min-h-screen text-slate-100 antialiased">
                {children}
            </body>
        </html>
    );
}