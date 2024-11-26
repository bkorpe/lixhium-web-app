/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    distDir: 'dist',
    images: {
        domains: ['maps.googleapis.com'],
    },
}

module.exports = nextConfig 