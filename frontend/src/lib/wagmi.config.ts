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
    pollingInterval: 10_000,
    ssr: true,
    syncConnectedChain: true,
    transports: {
      [hardhat.id]: http(undefined, { batch: true }),
      [base.id]: http(`${ALCHEMY_ENDPOINT_URL_BASE_MAINNET}${ALCHEMY_API_KEY}`, { batch: true }),
      [baseSepolia.id]: http(`${ALCHEMY_ENDPOINT_URL_BASE_SEPOLIA}${ALCHEMY_API_KEY}`, { batch: true }),
    },
    walletConnectProjectId: WALLET_CONNECT_PROJECT_ID,
  }),
});
