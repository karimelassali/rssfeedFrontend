/** @type {import('next').NextConfig} */
module.exports = {
  output: "export", // يسمح بتصدير الموقع كملفات HTML ثابتة
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
