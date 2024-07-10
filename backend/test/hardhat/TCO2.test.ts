import { expect } from 'chai';
import { ethers } from 'hardhat';
import { TCO2 } from '@/typechain-types/contracts';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { btoa } from 'buffer';
import { json as project1_json, base64 as project1_base64 } from '@/test/mocks/metadata_project_1.data';
import { json as project2_json, base64 as project2_base64 } from '@/test/mocks/metadata_project_2.data';

enum CustomError {
  ERC1155InvalidArrayLength = 'ERC1155InvalidArrayLength', // ERC1155InvalidArrayLength(uint256 idsLength, uint256 valuesLength)
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
    const tco2Contract = await ethers.deployContract('TCO2', [owner, addr2]);
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
      testRoyalty({ address: royaltyInfo[0], amount: royaltyInfo[1] }, { address: addr2.address, amount: BigInt(500) });
      expect(await tco2Contract.owner()).to.equal(owner);
    });
  });

  describe('burnBalanceOf', () => {
    it('should give the correct burn balance amount for the given account and token id', async () => {
      const ACCOUNT = addr1;
      const TOKEN_ID = 0;
      const BURN_AMOUNT = 10;
      await tco2Contract.mint(ACCOUNT, TOKEN_ID, 123, 'mock_metadata');
      await tco2Contract.connect(ACCOUNT).burn(ACCOUNT, TOKEN_ID, BURN_AMOUNT);
      expect(await tco2Contract.burnBalanceOf(ACCOUNT, TOKEN_ID)).to.equal(BURN_AMOUNT);
    });

    it('should give a burn balance amount of 0 for an account that did not burn anything', async () => {
      const ACCOUNT = addr1;
      const TOKEN_ID = 0;
      const BURN_AMOUNT = 10;
      await tco2Contract.mint(ACCOUNT, TOKEN_ID, 123, 'mock_metadata');
      await tco2Contract.connect(ACCOUNT).burn(ACCOUNT, TOKEN_ID, BURN_AMOUNT);
      expect(await tco2Contract.burnBalanceOf(addr2, TOKEN_ID)).to.equal(0);
    });

    it('should give a burn balance amount of 0 for a token id that did have any burned token', async () => {
      const ACCOUNT = addr1;
      const TOKEN_ID = 0;
      const BURN_AMOUNT = 10;
      await tco2Contract.mint(ACCOUNT, TOKEN_ID, 123, 'mock_metadata');
      await tco2Contract.connect(ACCOUNT).burn(ACCOUNT, TOKEN_ID, BURN_AMOUNT);
      expect(await tco2Contract.burnBalanceOf(addr2, 1)).to.equal(0);
    });
  });

  describe('burnBalanceOfBatch', () => {
    it('should give the correct burn balances amounts for the given accounts and token ids', async () => {
      const ACCOUNTS = [addr1, addr2];
      const TOKEN_IDS = [0, 0];
      const BURN_AMOUNT = 10;
      await tco2Contract.mint(ACCOUNTS[0], TOKEN_IDS[0], 123, 'mock_metadata');
      await tco2Contract.connect(ACCOUNTS[0]).burn(ACCOUNTS[0], TOKEN_IDS[0], BURN_AMOUNT);
      expect(await tco2Contract.burnBalanceOfBatch(ACCOUNTS, TOKEN_IDS)).to.deep.equal([BURN_AMOUNT, 0]);
    });

    it('should reject with an error when the two arrays do not have the same length', async () => {
      const ACCOUNTS = [addr1]; // length: 1
      const TOKEN_IDS = [0, 0]; // length: 2
      await expect(tco2Contract.burnBalanceOfBatch(ACCOUNTS, TOKEN_IDS))
        .to.revertedWithCustomError(tco2Contract, CustomError.ERC1155InvalidArrayLength)
        .withArgs(2, 1);
    });
  });

  describe('mint', () => {
    it('should mint new tokens', async () => {
      const ACCOUNT_TO = addr1;
      const TOKEN_ID = 0;
      const MINT_AMOUNT = 10;
      await tco2Contract.connect(owner).mint(ACCOUNT_TO, TOKEN_ID, MINT_AMOUNT, toBase64(project1_json));
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
      await tco2Contract.connect(owner).mint(ACCOUNT_TO, TOKEN_ID, INITIAL_MINT_AMOUNT, toBase64(project1_json));
      // Mint additional tokens.
      await tco2Contract.connect(owner).mint(ACCOUNT_TO, TOKEN_ID, MINT_AMOUNT, '');
      expect(await tco2Contract.exists(TOKEN_ID)).to.equal(true);
      expect(await tco2Contract.balanceOf(ACCOUNT_TO, TOKEN_ID)).to.equal(INITIAL_MINT_AMOUNT + MINT_AMOUNT);
      expect(await tco2Contract['totalSupply()']()).to.equal(INITIAL_MINT_AMOUNT + MINT_AMOUNT);
      expect(await tco2Contract['totalSupply(uint256)'](TOKEN_ID)).to.equal(INITIAL_MINT_AMOUNT + MINT_AMOUNT);
      expect(await tco2Contract['totalSupply(uint256)'](TOKEN_ID + 1)).to.equal(0);
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
      await tco2Contract.connect(owner).mint(addr1, TOKEN_ID, 10, toBase64(project1_json));
      // Mint additional tokens with metadata.
      await expect(tco2Contract.connect(owner).mint(addr1, TOKEN_ID, 10, toBase64(project1_json)))
        .to.be.revertedWithCustomError(tco2Contract, CustomError.TokenMetadataExists)
        .withArgs(TOKEN_ID);
    });

    it('should revert with an error when the token amount to mint is 0', async () => {
      await expect(
        tco2Contract.connect(owner).mint(addr1, 0, 0, toBase64(project1_json)),
      ).to.be.revertedWithCustomError(tco2Contract, CustomError.MintAmountZero);
    });

    it('should revert with an error when the msg.sender is not the owner of the contract', async () => {
      const ACCOUNT_TO = addr1;
      await expect(tco2Contract.connect(addr1).mint(ACCOUNT_TO, 0, 10, toBase64(project1_json)))
        .to.be.revertedWithCustomError(tco2Contract, CustomError.OwnableUnauthorizedAccount)
        .withArgs(ACCOUNT_TO);
    });
  });

  describe('contractURI', () => {
    it('should return the contract uri', async () => {
      expect(await tco2Contract.contractURI()).to.equal(
        `data:application/json;utf8,{"name":"CarbonThink TCO2","description":"CarbonThink TCO2 tokens collection.","external_link":"https://alyra-carbonthink.vercel.app/","image_data":"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 24 24' fill='green' stroke='#004000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z'></path><path d='M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12'></path></svg>"}`,
      );
    });
  });

  describe('supportsInterface', () => {
    it('should support the interface ERC-1155 (Multi Token Standard)', async () => {
      expect(await tco2Contract.supportsInterface('0xd9b67a26')).to.equal(true);
    });

    it('should support the interface ERC-2981 (NFT Royalty Standard)', async () => {
      expect(await tco2Contract.supportsInterface('0x2a55205a')).to.equal(true);
    });

    it('should support the interface ERC-165 (Standard Interface Detection)', async () => {
      expect(await tco2Contract.supportsInterface('0x01ffc9a7')).to.equal(true);
    });

    it('should not support a random interface hash', async () => {
      expect(await tco2Contract.supportsInterface('0x00000000')).to.equal(false);
    });
  });

  describe('totalBurnSupply(uint256)', () => {
    it('should return the correct amount of tokens burnt for the given token id', async () => {
      const ACCOUNT = addr1;
      const TOKEN_ID = 0;
      const BURN_AMOUNT = 10;
      await tco2Contract.mint(ACCOUNT, TOKEN_ID, 123, 'mock_metadata');
      await tco2Contract.connect(ACCOUNT).burn(ACCOUNT, TOKEN_ID, BURN_AMOUNT);
      expect(await tco2Contract['totalBurnSupply(uint256)'](TOKEN_ID)).to.equal(BURN_AMOUNT);
    });

    it('should return 0 for a token id that has not been burn', async () => {
      expect(await tco2Contract['totalBurnSupply(uint256)'](0)).to.equal(0);
    });
  });

  describe('totalBurnSupply()', () => {
    it('should return the correct amount of tokens burnt for all token ids', async () => {
      const ACCOUNT = addr1;
      const BURN_AMOUNT = 10;
      await tco2Contract.mint(ACCOUNT, 0, 123, 'mock_metadata');
      await tco2Contract.mint(ACCOUNT, 1, 123, 'mock_metadata');
      await tco2Contract.connect(ACCOUNT).burn(ACCOUNT, 0, BURN_AMOUNT);
      await tco2Contract.connect(ACCOUNT).burn(ACCOUNT, 1, BURN_AMOUNT);
      expect(await tco2Contract['totalBurnSupply()']()).to.equal(BURN_AMOUNT * 2);
    });

    it('should return 0 when no burn has been done', async () => {
      expect(await tco2Contract['totalBurnSupply()']()).to.equal(0);
    });
  });

  describe('uri', () => {
    it('should return the correct uri for the given tokenId', async () => {
      const TOKEN_ID = 0;
      await tco2Contract.mint(owner, TOKEN_ID, 10, toBase64(project1_json));
      expect(await tco2Contract.uri(TOKEN_ID)).to.equal(`data:application/json;base64,${project1_base64}`);
    });

    it('should return the correct uri for another given tokenId', async () => {
      const TOKEN_ID = 1;
      await tco2Contract.mint(owner, TOKEN_ID, 11, toBase64(project2_json));
      expect(await tco2Contract.uri(TOKEN_ID)).to.equal(`data:application/json;base64,${project2_base64}`);
    });
  });
});
