/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'swlfljsfujptehmawnai.supabase.co',
      },
    ],
  },
};
module.exports = nextConfig;
