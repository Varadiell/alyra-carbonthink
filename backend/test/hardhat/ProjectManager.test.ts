import { expect } from 'chai';
import { ethers } from 'hardhat';
import { ProjectManager, TCO2 } from '@/typechain-types/contracts';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';

enum Event {
  DocumentAdded = 'DocumentAdded',
  PhotoAdded = 'PhotoAdded',
  Created = 'Created',
  Minted = 'Minted',
  StatusChanged = 'StatusChanged',
}

enum Status {
  Canceled,
  Pending,
  Active,
  Completed,
}

enum CustomError {
  AddressZero = 'AddressZero',
  CannotChangeProjectState = 'CannotChangeProjectState',
  CannotMintZeroToken = 'CannotMintZeroToken',
  InactiveProject = 'InactiveProject',
  InvalidMetadata = 'InvalidMetadata',
  OwnableInvalidOwner = 'OwnableInvalidOwner',
  OwnableUnauthorizedAccount = 'OwnableUnauthorizedAccount',
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
      expect(await projectManagerContract.securityFund()).to.equal(addr2);
      expect(await projectManagerContract.tco2Contract()).to.equal(tco2Contract);
      expect(await projectManagerContract.totalProjects()).to.equal(0);
    });

    it('should not deploy the contract when the tco2 contract address is the zero address', async () => {
      await expect(
        ethers.deployContract('ProjectManager', [owner, addr2, ethers.ZeroAddress]),
      ).to.be.revertedWithCustomError(projectManagerContract, CustomError.AddressZero);
    });

    it('should not deploy the contract when the security fund address is the zero address', async () => {
      await expect(
        ethers.deployContract('ProjectManager', [owner, ethers.ZeroAddress, tco2Contract]),
      ).to.be.revertedWithCustomError(projectManagerContract, CustomError.AddressZero);
    });

    it('should not deploy the contract when the initialOwner is the zero address', async () => {
      await expect(
        ethers.deployContract('ProjectManager', [ethers.ZeroAddress, addr2, tco2Contract]),
      ).to.be.revertedWithCustomError(projectManagerContract, CustomError.OwnableInvalidOwner);
    });
  });

  describe('addDocument', () => {
    beforeEach(async () => {
      // Create a project.
      await projectManagerContract.create({
        projectHolder: addr1,
        name: 'Project 1',
        description: 'The first CarbonThink project.',
        externalUrl: 'https://alyra-carbonthink.vercel.app/project/0',
        image: 'ipfs://bafybeifkvccastjvmile7ovjnuhdahy3gsv2omoppr5zqzlimchwpz4vli/',
        data: {
          duration: BigInt(15),
          ares: BigInt(40000),
          expectedCo2Tons: BigInt(0),
          startDate: BigInt(1710889200),
          continent: 'Europe',
          country: 'France',
          region: 'Pays de la loire',
          province: 'Loire-Atlantique',
          city: 'Nantes',
          location: 'Place Général Mellinet',
          coordinates: '47.211449, -1.576292',
          plantedSpecies: 'Bamboo',
          calculationMethod: 'VCS',
          unSDGs: [BigInt(6), BigInt(11), BigInt(12), BigInt(13), BigInt(14), BigInt(15)],
        },
      } satisfies ProjectManager.CreateParamsStruct);
    });

    it('should add a document to a given project', async () => {
      const PROJECT_ID = 0;
      const DOCUMENT_URL = 'ipfs://QmT5pFzHUqAutGTabky8Kgbc51GS8WSU2yjM9mDYEikQSx/';
      await expect(projectManagerContract.addDocument(PROJECT_ID, DOCUMENT_URL))
        .to.emit(projectManagerContract, Event.DocumentAdded)
        .withArgs(PROJECT_ID);
      const documentUrls = (await projectManagerContract.get(PROJECT_ID)).documentUrls;
      expect(documentUrls.length).to.equal(1);
      expect(documentUrls[0]).to.equal(DOCUMENT_URL);
    });

    it('should add multiple documents to a given project', async () => {
      const PROJECT_ID = 0;
      const DOCUMENT_URL = 'ipfs://QmT5pFzHUqAutGTabky8Kgbc51GS8WSU2yjM9mDYEikQSx/';
      const DOCUMENT_2_URL = 'ipfs://QmPeKYLrTzwHCsbviFdePdXochzcdMWVwrTH3zy2N6LenU/';
      await expect(projectManagerContract.addDocument(PROJECT_ID, DOCUMENT_URL))
        .to.emit(projectManagerContract, Event.DocumentAdded)
        .withArgs(PROJECT_ID);
      await expect(projectManagerContract.addDocument(PROJECT_ID, DOCUMENT_2_URL))
        .to.emit(projectManagerContract, Event.DocumentAdded)
        .withArgs(PROJECT_ID);
      const documentUrls = (await projectManagerContract.get(0)).documentUrls;
      expect(documentUrls.length).to.equal(2);
      expect(documentUrls[0]).to.equal(DOCUMENT_URL);
      expect(documentUrls[1]).to.equal(DOCUMENT_2_URL);
    });

    it('should not add a document when the project is inactive (case: status completed)', async () => {
      const PROJECT_ID = 0;
      await projectManagerContract.setStatus(PROJECT_ID, Status.Completed);
      await expect(
        projectManagerContract.addDocument(PROJECT_ID, 'ipfs://QmT5pFzHUqAutGTabky8Kgbc51GS8WSU2yjM9mDYEikQSx/'),
      ).to.revertedWithCustomError(projectManagerContract, CustomError.InactiveProject);
    });

    it('should not add a document when the project is inactive (case: status canceled)', async () => {
      const PROJECT_ID = 0;
      await projectManagerContract.setStatus(PROJECT_ID, Status.Canceled);
      await expect(
        projectManagerContract.addDocument(PROJECT_ID, 'ipfs://QmT5pFzHUqAutGTabky8Kgbc51GS8WSU2yjM9mDYEikQSx/'),
      ).to.revertedWithCustomError(projectManagerContract, CustomError.InactiveProject);
    });

    it('should not add a document when the project does not exist', async () => {
      await expect(
        projectManagerContract.addDocument(1, 'ipfs://QmT5pFzHUqAutGTabky8Kgbc51GS8WSU2yjM9mDYEikQSx/'),
      ).to.revertedWithCustomError(projectManagerContract, CustomError.ProjectDoesNotExist);
    });

    it('should not add a document when the project does not exist', async () => {
      await expect(
        projectManagerContract.connect(addr1).addDocument(0, 'ipfs://QmT5pFzHUqAutGTabky8Kgbc51GS8WSU2yjM9mDYEikQSx/'),
      ).to.revertedWithCustomError(projectManagerContract, CustomError.OwnableUnauthorizedAccount);
    });
  });
});
