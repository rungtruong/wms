/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
};

module.exports = nextConfig;