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
  const callTransferOwner = module.call(tco2, 'transferOwnership', [projectManager], {
    after: [projectManager],
    id: 'TransferTco2Ownership',
  });

  // --- PROJECTS RANDOMIZATION ---
  const NB_PROJECTS = 80;
  for (let i = 0; i < NB_PROJECTS; i++) {
    // === Generate randomized project.
    const mockProject = create_x(i);
    const callCreate = module.call(projectManager, 'create', [objectToTuple(mockProject)], {
      after: [callTransferOwner],
      id: `a_create_${i}`,
    });
    // === Set status.
    let callSetStatus: any;
    let statusToSet = getRandomNumber(0, 99);
    // 10% canceled - 20% pending - 60% live - 10% complete
    statusToSet = statusToSet < 10 ? 0 : statusToSet < 30 ? 1 : statusToSet < 90 ? 2 : 3;
    if (statusToSet !== 1) {
      callSetStatus = module.call(projectManager, 'setStatus', [BigInt(i), BigInt(statusToSet)], {
        after: [callCreate],
        id: `b_setStatus_${i}`,
      });
    }
    // === First token mint for active projects.
    let callMintTokens: any;
    if (!!callSetStatus && statusToSet === 2) {
      const canFirstMint = getRandomNumber(0, 3) !== 0; // 1/4 not minted
      if (canFirstMint) {
        const nbTokensToMint = getRandomNumber(1, Number(mockProject.data.expectedCo2Tons));
        callMintTokens = module.call(
          projectManager,
          'mintTokens',
          [BigInt(i), BigInt(nbTokensToMint), generateMetadataBase64(mockProject)],
          {
            after: [callSetStatus],
            id: `c_firstMint_${i}`,
          },
        );
      }
    }
    // === Second token mint for active projects that were first minted.
    if (callMintTokens) {
      const canMintAgain = Boolean(getRandomNumber(0, 1)); // 1/2 not re-minted
      if (canMintAgain) {
        const nbTokensToMint = getRandomNumber(1, Number(mockProject.data.expectedCo2Tons));
        module.call(projectManager, 'mintTokens', [BigInt(i), BigInt(nbTokensToMint), ''], {
          after: [callMintTokens],
          id: `d_secondMint_${i}`,
        });
      }
    }
  }
  return { tco2, projectManager };
});

export default ProjectManagerModule;
