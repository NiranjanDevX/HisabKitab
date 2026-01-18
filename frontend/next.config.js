/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compiler: {
        // Remove consoles in production
        removeConsole: process.env.NODE_ENV === "production",
    },
    images: {
        domains: ["localhost"],
    },
};

module.exports = nextConfig;
