import { expect } from 'chai';
import { ethers } from 'hardhat';
import { TCO2 } from '@/typechain-types/contracts';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';

type Royalty = {
  address: string;
  amount: bigint;
};
function testRoyalty(royalty: Royalty, royaltyCompare: Royalty) {
  expect(royalty.address).to.equal(royaltyCompare.address);
  expect(royalty.amount).to.equal(royaltyCompare.amount);
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
      const royaltyInfo = await tco2Contract.royaltyInfo(0, 10000);
      testRoyalty({ address: royaltyInfo[0], amount: royaltyInfo[1] }, { address: owner.address, amount: BigInt(500) });
      expect(await tco2Contract.owner()).to.equal(owner);
    });
  });
});
