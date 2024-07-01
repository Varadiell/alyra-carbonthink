import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'solidity-docgen';

const {
  ALCHEMY_API_KEY = '',
  ALCHEMY_ENDPOINT_URL_POLYGON_ZKEVM_CARDONA = '',
  ALCHEMY_ENDPOINT_URL_POLYGON_ZKEVM_MAINNET = '',
  ETHERSCAN_API_KEY = '',
  PRIVATE_KEY = '',
} = process.env;

const config: HardhatUserConfig = {
  docgen: { outputDir: 'doc' },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
  },
  // networks: {
  //   hardhat: {},
  //   polygonZkEvm: {
  //     accounts: [PRIVATE_KEY],
  //     chainId: 1101,
  //     url: ALCHEMY_ENDPOINT_URL_POLYGON_ZKEVM_MAINNET,
  //   },
  //   polygonZkEvmCardona: {
  //     accounts: [PRIVATE_KEY],
  //     chainId: 2442,
  //     url: ALCHEMY_ENDPOINT_URL_POLYGON_ZKEVM_CARDONA,
  //   },
  // },
  solidity: '0.8.24',
};

export default config;
