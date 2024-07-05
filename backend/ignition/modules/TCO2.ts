import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const OWNER_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const ROYALTIES_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

const TCO2Module = buildModule('TCO2Module', (module) => {
  const tco2 = module.contract('TCO2', [OWNER_ADDRESS, ROYALTIES_ADDRESS], {});
  return { tco2 };
});

export default TCO2Module;
