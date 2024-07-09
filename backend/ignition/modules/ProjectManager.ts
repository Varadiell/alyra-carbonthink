import { create_x, generateMetadataBase64, getRandomNumber } from '@/test/mocks/mocks';
import { objectToTuple } from '@/utils/objectToTuple';
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
  module.call(tco2, 'transferOwnership', [projectManager], { id: 'TransferTco2Ownership' });

  // --- PROJECTS RANDOMIZATION ---
  const projects = [];
  const NB_PROJECTS = 100;
  // Generate randomized projects.
  for (let i = 0; i < NB_PROJECTS; i++) {
    const mockProject = create_x(i);
    projects[i] = mockProject;
    module.call(projectManager, 'create', [objectToTuple(mockProject)], { id: `a_create_${i}` });
  }
  // Set statuses.
  for (let i = 0; i < NB_PROJECTS; i++) {
    let statusToSet = getRandomNumber(0, 99);
    // 10% canceled - 20% pending - 60% live - 10% complete
    statusToSet = statusToSet < 10 ? 0 : statusToSet < 30 ? 1 : statusToSet < 90 ? 2 : 3;
    if (statusToSet !== 1) {
      module.call(projectManager, 'setStatus', [BigInt(i), BigInt(statusToSet)], { id: `b_setStatus_${i}` });
      if ([0, 3].includes(statusToSet)) {
        projects[i] = null; // Set to null to prevent minting on next step.
      }
    }
  }
  // First token mint for active projects.
  for (let i = 0; i < NB_PROJECTS; i++) {
    const project = projects[i];
    if (project != null) {
      const canFirstMint = getRandomNumber(0, 3) !== 0; // 1/4 not minted
      if (canFirstMint) {
        const nbTokensToMint = getRandomNumber(50, 1000);
        module.call(
          projectManager,
          'mintTokens',
          [BigInt(i), BigInt(nbTokensToMint), generateMetadataBase64(project)],
          {
            id: `c_firstMint_${i}`,
          },
        );
      }
    }
  }
  // Second token mint for active projects that were first minted.
  for (let i = 0; i < NB_PROJECTS; i++) {
    const project = projects[i];
    if (project != null) {
      const canMintAgain = Boolean(getRandomNumber(0, 1)); // 1/2 not re-minted
      if (canMintAgain) {
        const nbTokensToMint = getRandomNumber(50, 1000);
        module.call(projectManager, 'mintTokens', [BigInt(i), BigInt(nbTokensToMint), ''], { id: `d_secondMint_${i}` });
      }
    }
  }
  return { tco2, projectManager };
});

export default ProjectManagerModule;
