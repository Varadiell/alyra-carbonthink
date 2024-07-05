import { expect } from 'chai';
import { ethers } from 'hardhat';
import { ProjectManager, TCO2 } from '@/typechain-types/contracts';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { CREATE_1, CREATE_2 } from '@/test/mocks/mocks';

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
    const DOCUMENT_URL = 'ipfs://QmT5pFzHUqAutGTabky8Kgbc51GS8WSU2yjM9mDYEikQSx/';
    const DOCUMENT_2_URL = 'ipfs://QmPeKYLrTzwHCsbviFdePdXochzcdMWVwrTH3zy2N6LenU/';

    beforeEach(async () => {
      // Create a project.
      await projectManagerContract.create(CREATE_1);
    });

    it('should add a document to a given project', async () => {
      const PROJECT_ID = 0;
      await expect(projectManagerContract.addDocument(PROJECT_ID, DOCUMENT_URL))
        .to.emit(projectManagerContract, Event.DocumentAdded)
        .withArgs(PROJECT_ID);
      const documentUrls = (await projectManagerContract.get(PROJECT_ID)).documentUrls;
      expect(documentUrls.length).to.equal(1);
      expect(documentUrls[0]).to.equal(DOCUMENT_URL);
    });

    it('should add multiple documents to a given project', async () => {
      const PROJECT_ID = 0;
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
      await expect(projectManagerContract.addDocument(PROJECT_ID, DOCUMENT_URL)).to.revertedWithCustomError(
        projectManagerContract,
        CustomError.InactiveProject,
      );
    });

    it('should not add a document when the project is inactive (case: status canceled)', async () => {
      const PROJECT_ID = 0;
      await projectManagerContract.setStatus(PROJECT_ID, Status.Canceled);
      await expect(projectManagerContract.addDocument(PROJECT_ID, DOCUMENT_URL)).to.revertedWithCustomError(
        projectManagerContract,
        CustomError.InactiveProject,
      );
    });

    it('should not add a document when the project does not exist', async () => {
      await expect(projectManagerContract.addDocument(1, DOCUMENT_URL)).to.revertedWithCustomError(
        projectManagerContract,
        CustomError.ProjectDoesNotExist,
      );
    });

    it('should not add a document when the user has no rights', async () => {
      await expect(projectManagerContract.connect(addr1).addDocument(0, DOCUMENT_URL)).to.revertedWithCustomError(
        projectManagerContract,
        CustomError.OwnableUnauthorizedAccount,
      );
    });
  });

  describe('addPhoto', () => {
    const PHOTO_URL = 'ipfs://QmZpq4777YFLQkZpxnckC7a6pvhN7YdfxDHmTkkSPPLp4y/';
    const PHOTO_2_URL = 'ipfs://QmUyTvasFiWDhxg3WwTT3B4WMKP4jTxyDGVo5zD7chngPS/';

    beforeEach(async () => {
      // Create a project.
      await projectManagerContract.create(CREATE_1);
    });

    it('should add a photo to a given project', async () => {
      const PROJECT_ID = 0;
      await expect(projectManagerContract.addPhoto(PROJECT_ID, PHOTO_URL))
        .to.emit(projectManagerContract, Event.PhotoAdded)
        .withArgs(PROJECT_ID);
      const photoUrls = (await projectManagerContract.get(PROJECT_ID)).photoUrls;
      expect(photoUrls.length).to.equal(1);
      expect(photoUrls[0]).to.equal(PHOTO_URL);
    });

    it('should add multiple photos to a given project', async () => {
      const PROJECT_ID = 0;
      await expect(projectManagerContract.addPhoto(PROJECT_ID, PHOTO_URL))
        .to.emit(projectManagerContract, Event.PhotoAdded)
        .withArgs(PROJECT_ID);
      await expect(projectManagerContract.addPhoto(PROJECT_ID, PHOTO_2_URL))
        .to.emit(projectManagerContract, Event.PhotoAdded)
        .withArgs(PROJECT_ID);
      const photoUrls = (await projectManagerContract.get(0)).photoUrls;
      expect(photoUrls.length).to.equal(2);
      expect(photoUrls[0]).to.equal(PHOTO_URL);
      expect(photoUrls[1]).to.equal(PHOTO_2_URL);
    });

    it('should not add a photo when the project is inactive (case: status completed)', async () => {
      const PROJECT_ID = 0;
      await projectManagerContract.setStatus(PROJECT_ID, Status.Completed);
      await expect(projectManagerContract.addPhoto(PROJECT_ID, PHOTO_URL)).to.revertedWithCustomError(
        projectManagerContract,
        CustomError.InactiveProject,
      );
    });

    it('should not add a photo when the project is inactive (case: status canceled)', async () => {
      const PROJECT_ID = 0;
      await projectManagerContract.setStatus(PROJECT_ID, Status.Canceled);
      await expect(projectManagerContract.addPhoto(PROJECT_ID, PHOTO_URL)).to.revertedWithCustomError(
        projectManagerContract,
        CustomError.InactiveProject,
      );
    });

    it('should not add a photo when the project does not exist', async () => {
      await expect(projectManagerContract.addPhoto(1, PHOTO_URL)).to.revertedWithCustomError(
        projectManagerContract,
        CustomError.ProjectDoesNotExist,
      );
    });

    it('should not add a photo when the user has no rights', async () => {
      await expect(projectManagerContract.connect(addr1).addPhoto(0, PHOTO_URL)).to.revertedWithCustomError(
        projectManagerContract,
        CustomError.OwnableUnauthorizedAccount,
      );
    });
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const PROJECT_ID = 0;
      await expect(projectManagerContract.create(CREATE_1))
        .to.emit(projectManagerContract, Event.Created)
        .withArgs(PROJECT_ID);
      const project = await projectManagerContract.get(PROJECT_ID);
      expect(project.isRegistered).to.equal(true);
      expect(project.projectHolder).to.equal(CREATE_1.projectHolder);
      expect(project.id).to.equal(PROJECT_ID);
      expect(project.name).to.equal(CREATE_1.name);
      expect(project.description).to.equal(CREATE_1.description);
      expect(project.externalUrl).to.equal(CREATE_1.externalUrl);
      expect(project.image).to.equal(CREATE_1.image);
      expect(project.photoUrls.length).to.equal(0);
      expect(project.documentUrls.length).to.equal(0);
      expect(project.data.duration).to.equal(CREATE_1.data.duration);
      expect(project.data.ares).to.equal(CREATE_1.data.ares);
      expect(project.data.expectedCo2Tons).to.equal(CREATE_1.data.expectedCo2Tons);
      expect(project.data.startDate).to.equal(CREATE_1.data.startDate);
      expect(project.data.continent).to.equal(CREATE_1.data.continent);
      expect(project.data.country).to.equal(CREATE_1.data.country);
      expect(project.data.region).to.equal(CREATE_1.data.region);
      expect(project.data.province).to.equal(CREATE_1.data.province);
      expect(project.data.city).to.equal(CREATE_1.data.city);
      expect(project.data.location).to.equal(CREATE_1.data.location);
      expect(project.data.coordinates).to.equal(CREATE_1.data.coordinates);
      expect(project.data.plantedSpecies).to.equal(CREATE_1.data.plantedSpecies);
      expect(project.data.calculationMethod).to.equal(CREATE_1.data.calculationMethod);
      expect(project.data.unSDGs.length).to.equal(CREATE_1.data.unSDGs.length);
      expect(project.status).to.equal(Status.Pending);
      expect(await projectManagerContract.totalProjects()).to.equal(1);
    });

    it('should create another new project', async () => {
      const PROJECT_ID = 0;
      await expect(projectManagerContract.create(CREATE_2))
        .to.emit(projectManagerContract, Event.Created)
        .withArgs(PROJECT_ID);
      const project = await projectManagerContract.get(PROJECT_ID);
      expect(project.isRegistered).to.equal(true);
      expect(project.projectHolder).to.equal(CREATE_2.projectHolder);
      expect(project.id).to.equal(PROJECT_ID);
      expect(project.name).to.equal(CREATE_2.name);
      expect(project.description).to.equal(CREATE_2.description);
      expect(project.externalUrl).to.equal(CREATE_2.externalUrl);
      expect(project.image).to.equal(CREATE_2.image);
      expect(project.photoUrls.length).to.equal(0);
      expect(project.documentUrls.length).to.equal(0);
      expect(project.data.duration).to.equal(CREATE_2.data.duration);
      expect(project.data.ares).to.equal(CREATE_2.data.ares);
      expect(project.data.expectedCo2Tons).to.equal(CREATE_2.data.expectedCo2Tons);
      expect(project.data.startDate).to.equal(CREATE_2.data.startDate);
      expect(project.data.continent).to.equal(CREATE_2.data.continent);
      expect(project.data.country).to.equal(CREATE_2.data.country);
      expect(project.data.region).to.equal(CREATE_2.data.region);
      expect(project.data.province).to.equal(CREATE_2.data.province);
      expect(project.data.city).to.equal(CREATE_2.data.city);
      expect(project.data.location).to.equal(CREATE_2.data.location);
      expect(project.data.coordinates).to.equal(CREATE_2.data.coordinates);
      expect(project.data.plantedSpecies).to.equal(CREATE_2.data.plantedSpecies);
      expect(project.data.calculationMethod).to.equal(CREATE_2.data.calculationMethod);
      expect(project.data.unSDGs.length).to.equal(CREATE_2.data.unSDGs.length);
      expect(project.status).to.equal(Status.Pending);
      expect(await projectManagerContract.totalProjects()).to.equal(1);
    });

    it('should not create a new project when the user has no rights', async () => {
      await expect(projectManagerContract.connect(addr1).create(CREATE_1)).to.revertedWithCustomError(
        projectManagerContract,
        CustomError.OwnableUnauthorizedAccount,
      );
    });
  });

  describe('get', () => {
    beforeEach(async () => {
      // Create two projects.
      await projectManagerContract.create(CREATE_1);
      await projectManagerContract.create(CREATE_2);
    });

    it('should get the first project', async () => {
      expect((await projectManagerContract.get(0)).data.location).to.equal(CREATE_1.data.location);
    });

    it('should get the second project', async () => {
      expect((await projectManagerContract.get(1)).data.location).to.equal(CREATE_2.data.location);
    });

    it('should revert with an error when the project does not exist', async () => {
      await expect(projectManagerContract.get(2)).to.revertedWithCustomError(
        projectManagerContract,
        CustomError.ProjectDoesNotExist,
      );
    });
  });
});
