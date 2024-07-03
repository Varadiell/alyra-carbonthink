import { expect } from 'chai';
import { ethers } from 'hardhat';
import { TCO2 } from '@/typechain-types/contracts';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { btoa } from 'buffer';
import { json as project1_json, base64 as project1_base64 } from '@/test/mocks/metadata_project_1.data';

enum CustomError {
  MintAmountZero = 'MintAmountZero',
  MintEmptyMetadata = 'MintEmptyMetadata',
  OwnableUnauthorizedAccount = 'OwnableUnauthorizedAccount', // OwnableUnauthorizedAccount(address account)
  TokenMetadataExists = 'TokenMetadataExists', // TokenMetadataExists(uint256 tokenId)
}

type Royalty = {
  address: string;
  amount: bigint;
};
function testRoyalty(royalty: Royalty, royaltyCompare: Royalty) {
  expect(royalty.address).to.equal(royaltyCompare.address);
  expect(royalty.amount).to.equal(royaltyCompare.amount);
}

function toBase64(str: string): string {
  return btoa(str);
}

describe('TCO2 token contract tests', () => {
  let tco2Contract: TCO2;
  let owner: HardhatEthersSigner, addr1: HardhatEthersSigner, addr2: HardhatEthersSigner;

  async function deployContractFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const tco2Contract = await ethers.deployContract('TCO2', [owner]);
    return { tco2Contract, owner, addr1, addr2 };
  }

  beforeEach(async () => {
    const fixture = await loadFixture(deployContractFixture);
    tco2Contract = fixture.tco2Contract;
    owner = fixture.owner;
    addr1 = fixture.addr1;
    addr2 = fixture.addr2;
  });

  describe('constructor', () => {
    it('should deploy the contract with the correct default values and owner address', async () => {
      const royaltyInfo = await tco2Contract.royaltyInfo(0, 10_000);
      testRoyalty({ address: royaltyInfo[0], amount: royaltyInfo[1] }, { address: owner.address, amount: BigInt(500) });
      expect(await tco2Contract.owner()).to.equal(owner);
    });
  });

  describe('mint', () => {
    it('should mint new tokens', async () => {
      const ACCOUNT_TO = addr1;
      const TOKEN_ID = 0;
      const MINT_AMOUNT = 10;
      await tco2Contract
        .connect(owner)
        .mint(ACCOUNT_TO, TOKEN_ID, MINT_AMOUNT, toBase64(JSON.stringify(project1_json)));
      expect(await tco2Contract.exists(TOKEN_ID)).to.equal(true);
      expect(await tco2Contract.balanceOf(ACCOUNT_TO, TOKEN_ID)).to.equal(MINT_AMOUNT);
      expect(await tco2Contract['totalSupply()']()).to.equal(MINT_AMOUNT);
      expect(await tco2Contract['totalSupply(uint256)'](TOKEN_ID)).to.equal(MINT_AMOUNT);
      expect(await tco2Contract['totalSupply(uint256)'](TOKEN_ID + 1)).to.equal(0);
      expect(await tco2Contract.uri(TOKEN_ID)).to.equal(`data:application/json;base64,${project1_base64}`);
    });

    it('should mint additional tokens for an existing token', async () => {
      const ACCOUNT_TO = addr1;
      const TOKEN_ID = 0;
      const MINT_AMOUNT = 10;
      const INITIAL_MINT_AMOUNT = 100;
      // First mint.
      await tco2Contract
        .connect(owner)
        .mint(ACCOUNT_TO, TOKEN_ID, INITIAL_MINT_AMOUNT, toBase64(JSON.stringify(project1_json)));
      // Mint additional tokens.
      await tco2Contract.connect(owner).mint(ACCOUNT_TO, TOKEN_ID, MINT_AMOUNT, '');
      expect(await tco2Contract.exists(TOKEN_ID)).to.equal(true);
      expect(await tco2Contract.balanceOf(ACCOUNT_TO, TOKEN_ID)).to.equal(INITIAL_MINT_AMOUNT + MINT_AMOUNT);
      expect(await tco2Contract['totalSupply()']()).to.equal(INITIAL_MINT_AMOUNT + MINT_AMOUNT);
      expect(await tco2Contract['totalSupply(uint256)'](TOKEN_ID)).to.equal(INITIAL_MINT_AMOUNT + MINT_AMOUNT);
      expect(await tco2Contract['totalSupply(uint256)'](TOKEN_ID + 1)).to.equal(0);
      console.log(await tco2Contract.uri(TOKEN_ID));
      expect(await tco2Contract.uri(TOKEN_ID)).to.equal(`data:application/json;base64,${project1_base64}`);
    });

    it('should revert with an error when the token does not exist but the metadata is empty', async () => {
      await expect(tco2Contract.connect(owner).mint(addr1, 0, 10, '')).to.be.revertedWithCustomError(
        tco2Contract,
        CustomError.MintEmptyMetadata,
      );
    });

    it('should revert with an error when the token exists and the metadata is not empty', async () => {
      const TOKEN_ID = 0;
      // First mint.
      await tco2Contract.connect(owner).mint(addr1, TOKEN_ID, 10, toBase64(JSON.stringify(project1_json)));
      // Mint additional tokens with metadata.
      await expect(tco2Contract.connect(owner).mint(addr1, TOKEN_ID, 10, toBase64(JSON.stringify(project1_json))))
        .to.be.revertedWithCustomError(tco2Contract, CustomError.TokenMetadataExists)
        .withArgs(TOKEN_ID);
    });

    it('should revert with an error when the token amount to mint is 0', async () => {
      await expect(
        tco2Contract.connect(owner).mint(addr1, 0, 0, toBase64(JSON.stringify(project1_json))),
      ).to.be.revertedWithCustomError(tco2Contract, CustomError.MintAmountZero);
    });

    it('should revert with an error when the msg.sender is not the owner of the contract', async () => {
      const ACCOUNT_TO = addr1;
      await expect(tco2Contract.connect(addr1).mint(ACCOUNT_TO, 0, 10, toBase64(JSON.stringify(project1_json))))
        .to.be.revertedWithCustomError(tco2Contract, CustomError.OwnableUnauthorizedAccount)
        .withArgs(ACCOUNT_TO);
    });
  });
});
