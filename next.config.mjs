/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {},
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
                module: false,
                v8: false,
                perf_hooks: false,
            };
        }
        return config;
    },
};

export default nextConfig;