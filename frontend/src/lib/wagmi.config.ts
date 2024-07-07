import { http, createConfig } from 'wagmi';
import { hardhat, base, baseSepolia } from 'wagmi/chains';
import { getDefaultConfig } from 'connectkit';
import { metaMask, coinbaseWallet, injected, safe } from 'wagmi/connectors';
import 'dotenv/config';

const {
  ALCHEMY_API_KEY = '',
  ALCHEMY_ENDPOINT_URL_BASE_MAINNET = '',
  ALCHEMY_ENDPOINT_URL_BASE_SEPOLIA = '',
  NODE_ENV = 'development',
  WALLET_CONNECT_PROJECT_ID = '',
} = process.env;

export const config = createConfig({
  ...getDefaultConfig({
    appDescription: 'CarbonThink',
    appIcon: 'https://alyra-carbonthink.vercel.app/carbonthink.svg',
    appName: 'CarbonThink',
    appUrl: 'https://alyra-carbonthink.vercel.app/',
    chains: NODE_ENV === 'production' ? [baseSepolia, base] : [hardhat, baseSepolia, base],
    connectors: [
      metaMask({
        dappMetadata: {
          name: 'CarbonThink',
        },
      }),
      coinbaseWallet(),
      injected(),
      safe(),
    ],
    pollingInterval: 10000,
    ssr: true,
    transports: {
      [hardhat.id]: http(),
      [base.id]: http(`${ALCHEMY_ENDPOINT_URL_BASE_MAINNET}${ALCHEMY_API_KEY}`),
      [baseSepolia.id]: http(`${ALCHEMY_ENDPOINT_URL_BASE_SEPOLIA}${ALCHEMY_API_KEY}`),
    },
    walletConnectProjectId: WALLET_CONNECT_PROJECT_ID,
  }),
});
