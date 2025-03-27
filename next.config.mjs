/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Increase to 10 MB
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  },
  images: {
    unoptimized: true, // Ensures Next.js serves local images
  },
};

export default nextConfig;
