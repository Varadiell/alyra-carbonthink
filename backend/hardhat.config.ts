import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomicfoundation/hardhat-verify';
import 'solidity-docgen';
import 'dotenv/config';
import 'tsconfig-paths/register'; // This adds support for typescript paths mappings

const {
  ALCHEMY_API_KEY = '',
  ALCHEMY_ENDPOINT_URL_BASE_MAINNET = '',
  ALCHEMY_ENDPOINT_URL_BASE_SEPOLIA = '',
  ETHERSCAN_API_KEY = '',
  PRIVATE_KEY = '',
} = process.env;

const config: HardhatUserConfig = {
  docgen: {
    outputDir: 'doc',
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
  },
  networks: {
    baseMainnet: {
      accounts: [PRIVATE_KEY],
      chainId: 8453,
      url: `${ALCHEMY_ENDPOINT_URL_BASE_MAINNET}${ALCHEMY_API_KEY}`,
    },
    baseSepolia: {
      accounts: [PRIVATE_KEY],
      chainId: 84532,
      url: `${ALCHEMY_ENDPOINT_URL_BASE_SEPOLIA}${ALCHEMY_API_KEY}`,
    },
    hardhat: {},
  },
  solidity: '0.8.24',
};

export default config;
