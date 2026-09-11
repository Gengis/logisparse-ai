import { Inter } from 'next/font/google';

export const metadata = {
    title: 'IA Soberana - Hackathon',
    description: 'Procesamiento local seguro sin la nube',
    manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}