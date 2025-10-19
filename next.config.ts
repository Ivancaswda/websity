import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    eslint: {
        ignoreDuringBuilds: true, // отключает ESLint при сборке
    },
    typescript: {
        ignoreBuildErrors: true, // отключает ошибки TypeScript при сборке
    },
};

export default nextConfig;
