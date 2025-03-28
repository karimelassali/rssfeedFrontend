/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: ['imgs.search.brave.com','source.unsplash.com','picsum.photos','www.ansa.it','www.ansa.it',"www.regione.vda.it",'www.regione.vda.it'],
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
