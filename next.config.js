/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['https://gold-avenue-tech-challenge.netlify.app/'],
    unoptimized: true,
  },
};

module.exports = nextConfig;
