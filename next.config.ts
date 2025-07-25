import type { NextConfig } from "next";
import path from "path";

const withPWA = require("next-pwa")({
    dest: "public",
    // disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
    // reactStrictMode: true,
    // turbopack: {
    //     root: path.join(__dirname, '..'),
    // },
    /* config options here */
    eslint: {
        ignoreDuringBuilds: true,  // <-- SKIPS lint errors during build
    },
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "1337",
            },
            {
                protocol: "https",
                hostname: "ecapi.rigyasa.com",
                // port: "1337",
            }
        ],
    },
};

// export default nextConfig;
// export default withPWA(nextConfig);
