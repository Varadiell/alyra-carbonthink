import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const ADDR_0 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Deployer.
const ADDR_1 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // Royalties.

const TCO2Module = buildModule('TCO2Module', (module) => {
  const tco2 = module.contract(
    'TCO2',
    [module.getParameter('owner_address', ADDR_0), module.getParameter('royalties_address', ADDR_1)],
    {},
  );
  return { tco2 };
});

export default TCO2Module;
