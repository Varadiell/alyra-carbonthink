import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const ADDR_0 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Deployer.
const ADDR_1 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // Royalties.
const ADDR_2 = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'; // Security Fund.

const ProjectManagerModule = buildModule('ProjectManagerModule', (module) => {
  // Deploy TCO2 contract (required in ProjectManager params).
  const tco2 = module.contract('TCO2', [
    module.getParameter('tco2_owner_address', ADDR_0),
    module.getParameter('tco2_royalties_address', ADDR_1),
  ]);
  // Deploy ProjectManager contract.
  const projectManager = module.contract('ProjectManager', [
    module.getParameter('project_manager_owner_address', ADDR_0),
    module.getParameter('project_manager_security_fund_address', ADDR_2),
    tco2,
  ]);
  // Transfer TCO2 ownership to the ProjectManager contract.
  module.call(tco2, 'transferOwnership', [projectManager]);
  return { tco2, projectManager };
});

export default ProjectManagerModule;
