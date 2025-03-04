/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: ['imgs.search.brave.com','source.unsplash.com','picsum.photos'],
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
