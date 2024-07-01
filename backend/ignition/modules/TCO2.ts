import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const AUTHORITY_ADDRESS = '0xD8B23ff6EE06CF04fb398fe95e9216f85cEA2EE4';

const TCO2Module = buildModule('TCO2Module', (module) => {
  const tco2 = module.contract('TCO2', [AUTHORITY_ADDRESS], {});
  return { tco2 };
});

export default TCO2Module;
