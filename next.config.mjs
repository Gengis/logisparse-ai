/** @type {import('next').NextConfig} */
const nextConfig = {
    // Le decimos a Next.js que ignore estas librerías nativas en su empaquetado
    serverExternalPackages: ['@qvac/sdk', 'pdf-extraction', 'tesseract.js'],
};

export default nextConfig;