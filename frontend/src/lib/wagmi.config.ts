import { http, createConfig } from 'wagmi';
import { hardhat, polygonZkEvmCardona, polygonZkEvm } from 'wagmi/chains';
import { getDefaultConfig } from 'connectkit';
import { metaMask, coinbaseWallet, injected, safe } from 'wagmi/connectors';

const {
  ALCHEMY_ENDPOINT_URL_POLYGON_ZKEVM_MAINNET = '',
  ALCHEMY_ENDPOINT_URL_POLYGON_ZKEVM_CARDONA = '',
  ALCHEMY_API_KEY = '',
  WALLET_CONNECT_PROJECT_ID = '',
} = process.env;

export const config = createConfig(
  getDefaultConfig({
    appDescription: 'The Ballot Project',
    // appIcon: "",
    appName: 'The Ballot Project',
    // appUrl: "",
    chains: [hardhat, polygonZkEvmCardona, polygonZkEvm],
    connectors: [
      metaMask({
        dappMetadata: {
          name: 'The Ballot Project',
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
      [polygonZkEvmCardona.id]: http(
        `${ALCHEMY_ENDPOINT_URL_POLYGON_ZKEVM_CARDONA}${ALCHEMY_API_KEY}`,
      ),
      [polygonZkEvm.id]: http(
        `${ALCHEMY_ENDPOINT_URL_POLYGON_ZKEVM_MAINNET}${ALCHEMY_API_KEY}`,
      ),
    },
    walletConnectProjectId: WALLET_CONNECT_PROJECT_ID,
  }),
);
