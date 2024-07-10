import { http, createConfig, fallback } from 'wagmi';
import { hardhat, base, baseSepolia } from 'wagmi/chains';
import { getDefaultConfig } from 'connectkit';
import { metaMask, coinbaseWallet, injected, safe } from 'wagmi/connectors';
import 'dotenv/config';

export const config = createConfig({
  ...getDefaultConfig({
    appDescription: 'CarbonThink',
    appIcon: 'https://alyra-carbonthink.vercel.app/carbonthink.svg',
    appName: 'CarbonThink',
    appUrl: 'https://alyra-carbonthink.vercel.app/',
    chains: process.env.NODE_ENV === 'production' ? [baseSepolia, base] : [baseSepolia, base, hardhat],
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
      [hardhat.id]: http(undefined, { batch: true, timeout: 60_000 }),
      [base.id]: http(`${process.env.ALCHEMY_ENDPOINT_URL_BASE_MAINNET}${process.env.ALCHEMY_API_KEY}`, {
        batch: true,
        timeout: 60_000,
      }),
      [baseSepolia.id]: fallback([
        http(`${process.env.ALCHEMY_ENDPOINT_URL_BASE_SEPOLIA}${process.env.ALCHEMY_API_KEY}`, {
          batch: true,
          timeout: 60_000,
        }),
        http(`https://base-sepolia-rpc.publicnode.com/`, { batch: true, timeout: 60_000 }),
      ]),
    },
    walletConnectProjectId: process.env.WALLET_CONNECT_PROJECT_ID ?? '',
  }),
});
