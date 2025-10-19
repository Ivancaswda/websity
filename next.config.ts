import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    eslint: {
        ignoreDuringBuilds: true, // отключает ESLint при сборке
    },
    typescript: {
        ignoreBuildErrors: true, // отключает ошибки TypeScript при сборке
    },
    images: {
        domains: ['lh3.googleusercontent.com', 'images.unsplash.com']
    }
};

export default nextConfig;
