import { http, createConfig } from 'wagmi';
import { hardhat, base, baseSepolia } from 'wagmi/chains';
import { getDefaultConfig } from 'connectkit';
import { metaMask, coinbaseWallet, injected, safe } from 'wagmi/connectors';
import 'dotenv/config';

const {
  ALCHEMY_API_KEY = '',
  ALCHEMY_ENDPOINT_URL_BASE_MAINNET = '',
  ALCHEMY_ENDPOINT_URL_BASE_SEPOLIA = '',
  WALLET_CONNECT_PROJECT_ID = '',
} = process.env;

export const config = createConfig(
  getDefaultConfig({
    appDescription: 'CarbonThink',
    // appIcon: "",
    appName: 'CarbonThink',
    // appUrl: "",
    chains: [hardhat, base, baseSepolia],
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
    pollingInterval: 3000, // Polygon zkEVM block time.
    ssr: true,
    transports: {
      [hardhat.id]: http(),
      [base.id]: http(`${ALCHEMY_ENDPOINT_URL_BASE_MAINNET}${ALCHEMY_API_KEY}`),
      [baseSepolia.id]: http(`${ALCHEMY_ENDPOINT_URL_BASE_SEPOLIA}${ALCHEMY_API_KEY}`),
    },
    walletConnectProjectId: WALLET_CONNECT_PROJECT_ID,
  }),
);
