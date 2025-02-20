/** @type {import('next').NextConfig} */
module.exports = {
  out
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
  }
};
