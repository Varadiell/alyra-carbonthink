import { expect } from 'chai';
import { ethers } from 'hardhat';
import { ProjectManager, TCO2 } from '@/typechain-types/contracts';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';

enum CustomError {
  AddressZero = 'AddressZero',
  CannotChangeProjectState = 'CannotChangeProjectState',
  CannotMintZeroToken = 'CannotMintZeroToken',
  InactiveProject = 'InactiveProject',
  InvalidMetadata = 'InvalidMetadata',
  ProjectDoesNotExist = 'ProjectDoesNotExist',
}

describe('ProjectManager contract tests', () => {
  let tco2Contract: TCO2;
  let projectManagerContract: ProjectManager;
  let owner: HardhatEthersSigner, addr1: HardhatEthersSigner, addr2: HardhatEthersSigner;

  async function deployContractFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    // Required for ProjectManager deployment.
    const tco2Contract = await ethers.deployContract('TCO2', [owner, addr2]);
    const projectManagerContract = await ethers.deployContract('ProjectManager', [owner, addr2, tco2Contract]);
    // Delegates the admin role to the ProjectManager contract.
    tco2Contract.transferOwnership(projectManagerContract);
    return { projectManagerContract, tco2Contract, owner, addr1, addr2 };
  }

  beforeEach(async () => {
    const fixture = await loadFixture(deployContractFixture);
    projectManagerContract = fixture.projectManagerContract;
    tco2Contract = fixture.tco2Contract;
    owner = fixture.owner;
    addr1 = fixture.addr1;
    addr2 = fixture.addr2;
  });

  describe('constructor', () => {
    it('should deploy the contract with the correct default values and owner address', async () => {
      expect(await projectManagerContract.owner()).to.equal(owner);
      expect(await projectManagerContract.tco2Contract()).to.equal(tco2Contract);
      expect(await projectManagerContract.securityFund()).to.equal(addr2);
    });
  });
});
