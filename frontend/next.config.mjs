/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY ?? '',
    ALCHEMY_ENDPOINT_URL_BASE_MAINNET: process.env.ALCHEMY_ENDPOINT_URL_BASE_MAINNET ?? '',
    ALCHEMY_ENDPOINT_URL_BASE_SEPOLIA: process.env.ALCHEMY_ENDPOINT_URL_BASE_SEPOLIA ?? '',
    WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID ?? '',
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'encoding');
    return config;
  },
};

export default nextConfig;
