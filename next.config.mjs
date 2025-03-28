/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  },
  images: {
    unoptimized: true,
    domains: ["roshnistore.com"], // Add your domain here
    path: "https://roshnistore.com", // Base path for images
  },
  trailingSlash: true, // Helps with some routing issues
};

export default nextConfig;
