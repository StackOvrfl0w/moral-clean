/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "1mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sjlmjakninsenljyastk.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
