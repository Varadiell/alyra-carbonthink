import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Ballot } from '@/typechain-types';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';

const YES_B32 = ethers.encodeBytes32String('Yes');
const MAYBE_B32 = ethers.encodeBytes32String('Maybe');
const NO_B32 = ethers.encodeBytes32String('No');
const ADDRESS_0 = '0x0000000000000000000000000000000000000000';

type Proposal = {
  name: string;
  voteCount: bigint;
};

type Voter = {
  delegate: string;
  vote: bigint;
  voted: boolean;
  weight: bigint;
};

function testVoter(voter: Voter, voterToCompare: Voter) {
  expect(voter.delegate).to.equal(voterToCompare.delegate);
  expect(voter.vote).to.equal(voterToCompare.vote);
  expect(voter.voted).to.equal(voterToCompare.voted);
  expect(voter.weight).to.equal(voterToCompare.weight);
}

function testProposal(proposal: Proposal, proposalToCompare: Proposal) {
  expect(proposal.name).to.equal(proposalToCompare.name);
  expect(proposal.voteCount).to.equal(proposalToCompare.voteCount);
}

describe('Voting tests', () => {
  let ballotContract: Ballot;
  let owner: HardhatEthersSigner,
    addr1: HardhatEthersSigner,
    addr2: HardhatEthersSigner,
    addr3: HardhatEthersSigner;

  async function deployContractFixture() {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    const ballotContract = await ethers.deployContract('Ballot', [
      [YES_B32, MAYBE_B32, NO_B32],
    ]);
    return { ballotContract, owner, addr1, addr2, addr3 };
  }

  beforeEach(async () => {
    const fixture = await loadFixture(deployContractFixture);
    ballotContract = fixture.ballotContract;
    owner = fixture.owner;
    addr1 = fixture.addr1;
    addr2 = fixture.addr2;
    addr3 = fixture.addr3;
  });

  describe('constructor', () => {
    it('should deploy the contract with the correct default values, chair person address, chair person weight and proposals', async () => {
      expect(await ballotContract.chairperson()).to.equal(owner);
      testVoter(await ballotContract.voters(owner), {
        delegate: ADDRESS_0,
        vote: 0n,
        voted: false,
        weight: 1n,
      });
      testProposal(await ballotContract.proposals(0), {
        name: YES_B32,
        voteCount: 0n,
      });
      testProposal(await ballotContract.proposals(1), {
        name: MAYBE_B32,
        voteCount: 0n,
      });
      testProposal(await ballotContract.proposals(2), {
        name: NO_B32,
        voteCount: 0n,
      });
      await expect(ballotContract.proposals(3)).to.be.revertedWithoutReason();
    });
  });

  describe('giveRightToVote', () => {
    it('should give the right to vote to the given address and emit an event when the msg.sender is the chairperson, the voter did not vote and the voter weight is 0', async () => {
      await expect(ballotContract.giveRightToVote(addr1))
        .to.emit(ballotContract, 'GiveRight')
        .withArgs(addr1);
      testVoter(await ballotContract.voters(addr1), {
        delegate: ADDRESS_0,
        vote: 0n,
        voted: false,
        weight: 1n,
      });
    });

    it('should revert without reason when the voter weight is not 0', async () => {
      await ballotContract.giveRightToVote(addr1);
      await expect(
        ballotContract.connect(owner).giveRightToVote(addr1),
      ).to.be.revertedWithoutReason();
    });

    it('should revert with a message when the voter already voted', async () => {
      await ballotContract.giveRightToVote(addr1);
      await ballotContract.connect(addr1).vote(1);
      await expect(ballotContract.giveRightToVote(addr1)).to.be.revertedWith(
        'The voter already voted.',
      );
    });

    it('should revert with a message when the msg.sender is not the chairman', async () => {
      await expect(
        ballotContract.connect(addr1).giveRightToVote(addr2),
      ).to.be.revertedWith('Only chairperson can give right to vote.');
    });
  });

  describe('delegate', () => {
    it('should delegate the vote to the given address (case: add weight) and emit an event when the msg.sender did not vote, the address is not the sender address, there is no delegation loop and the delegate did not vote', async () => {
      await ballotContract.giveRightToVote(addr1);
      await ballotContract.giveRightToVote(addr2);
      await expect(ballotContract.connect(addr1).delegate(addr2))
        .to.emit(ballotContract, 'Delegate')
        .withArgs(addr1, addr2);
      testVoter(await ballotContract.voters(addr1), {
        delegate: addr2.address,
        vote: 0n,
        voted: true,
        weight: 1n,
      });
      testVoter(await ballotContract.voters(addr2), {
        delegate: ADDRESS_0,
        vote: 0n,
        voted: false,
        weight: 2n,
      });
    });

    it('should delegate the vote to the given address (case: add vote) and emit an event when the msg.sender did not vote, the address is not the sender address and there is no delegation loop and the delegate voted', async () => {
      await ballotContract.giveRightToVote(addr1);
      await ballotContract.giveRightToVote(addr2);
      await ballotContract.connect(addr2).vote(1);
      await expect(ballotContract.connect(addr1).delegate(addr2))
        .to.emit(ballotContract, 'Delegate')
        .withArgs(addr1, addr2);
      testVoter(await ballotContract.voters(addr1), {
        delegate: addr2.address,
        vote: 0n,
        voted: true,
        weight: 1n,
      });
      testVoter(await ballotContract.voters(addr2), {
        delegate: ADDRESS_0,
        vote: 1n,
        voted: true,
        weight: 1n,
      });
      testProposal(await ballotContract.proposals(1), {
        name: MAYBE_B32,
        voteCount: 2n,
      });
    });

    it('should revert with an error when there is a delegation loop', async () => {
      await ballotContract.giveRightToVote(addr1);
      await ballotContract.giveRightToVote(addr2);
      await ballotContract.giveRightToVote(addr3);
      await ballotContract.connect(addr1).delegate(addr2);
      await ballotContract.connect(addr2).delegate(addr3);
      await expect(
        ballotContract.connect(addr3).delegate(addr1),
      ).to.be.revertedWith('Found loop in delegation.');
    });

    it('should revert in case of self-delegation', async () => {
      await ballotContract.giveRightToVote(addr1);
      await expect(
        ballotContract.connect(addr1).delegate(addr1),
      ).to.be.revertedWith('Self-delegation is disallowed.');
    });

    it('should revert when the sender already voted', async () => {
      await ballotContract.giveRightToVote(addr1);
      await ballotContract.connect(addr1).vote(1);
      await expect(
        ballotContract.connect(addr1).delegate(addr2),
      ).to.be.revertedWith('You already voted.');
    });
  });

  describe('vote', () => {
    it('should vote to the given proposal when the sender has the right to vote and did not vote', async () => {
      await ballotContract.giveRightToVote(addr1);
      await expect(ballotContract.connect(addr1).vote(1))
        .to.emit(ballotContract, 'Vote')
        .withArgs(addr1, 1);
      testVoter(await ballotContract.voters(addr1), {
        delegate: ADDRESS_0,
        vote: 1n,
        voted: true,
        weight: 1n,
      });
      testProposal(await ballotContract.proposals(1), {
        name: MAYBE_B32,
        voteCount: 1n,
      });
    });

    it('should revert with a message when the sender already voted', async () => {
      await ballotContract.giveRightToVote(addr1);
      await ballotContract.connect(addr1).vote(1);
      await expect(ballotContract.connect(addr1).vote(1)).to.be.revertedWith(
        'Already voted.',
      );
    });

    it('should revert with a message when the sender has no right to vote', async () => {
      await expect(ballotContract.connect(addr1).vote(1)).to.be.revertedWith(
        'Has no right to vote',
      );
    });
  });

  describe('winningProposal', () => {
    it('should compute the winning proposal (case: clear winner)', async () => {
      await ballotContract.giveRightToVote(addr1);
      await ballotContract.giveRightToVote(addr2);
      await ballotContract.connect(addr1).vote(1);
      await ballotContract.connect(addr2).vote(1);
      expect(await ballotContract.winningProposal()).to.equal(1);
    });

    it('should compute the winning proposal (case: majority)', async () => {
      await ballotContract.giveRightToVote(addr1);
      await ballotContract.giveRightToVote(addr2);
      await ballotContract.giveRightToVote(addr3);
      await ballotContract.connect(addr1).vote(1);
      await ballotContract.connect(addr2).vote(2);
      await ballotContract.connect(addr3).vote(2);
      expect(await ballotContract.winningProposal()).to.equal(2);
    });

    it('should compute the winning proposal (case: draw)', async () => {
      await ballotContract.giveRightToVote(addr1);
      await ballotContract.giveRightToVote(addr2);
      await ballotContract.connect(addr1).vote(1);
      await ballotContract.connect(addr2).vote(2);
      expect(await ballotContract.winningProposal()).to.equal(1);
    });
  });

  describe('winnerName', () => {
    it('should return the winner name', async () => {
      await ballotContract.giveRightToVote(addr1);
      await ballotContract.giveRightToVote(addr2);
      await ballotContract.connect(addr1).vote(1);
      await ballotContract.connect(addr2).vote(1);
      expect(await ballotContract.winnerName()).to.equal(MAYBE_B32);
    });

    it('should return another winner name', async () => {
      await ballotContract.giveRightToVote(addr1);
      await ballotContract.giveRightToVote(addr2);
      await ballotContract.connect(addr1).vote(2);
      await ballotContract.connect(addr2).vote(2);
      expect(await ballotContract.winnerName()).to.equal(NO_B32);
    });
  });
});
