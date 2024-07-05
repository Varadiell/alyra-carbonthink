import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const OWNER_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const SECURITY_FUND_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const TCO2_CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const ProjectManagerModule = buildModule('ProjectManagerModule', (module) => {
  const projectManager = module.contract(
    'ProjectManager',
    [OWNER_ADDRESS, SECURITY_FUND_ADDRESS, TCO2_CONTRACT_ADDRESS],
    {},
  );
  return { projectManager };
});

export default ProjectManagerModule;
