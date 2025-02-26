/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  images: {
    domains: ['imgs.search.brave.com'],
  },
  transpilePackages: ['@heroui/react'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
    };
    return config;
  },
  experimental: {
    forceSwcTransforms: true
  }
};
