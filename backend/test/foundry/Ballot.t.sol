// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {Ballot} from "@/contracts/Ballot.sol";

bytes32 constant YES_B32 = bytes32("Yes");
bytes32 constant MAYBE_B32 = bytes32("Maybe");
bytes32 constant NO_B32 = bytes32("No");

contract BallotTestHelper is Test {
    event GiveRight(address indexed voter);
    event Delegate(address indexed from, address indexed to);
    event Vote(address indexed voter, uint256 proposal);

    struct Voter {
        uint256 weight;
        bool voted;
        address delegate;
        uint256 vote;
    }

    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    address owner = makeAddr("user0");
    address addr1 = makeAddr("user1");
    address addr2 = makeAddr("user2");
    address addr3 = makeAddr("user3");

    Ballot public ballotContract;

    function testProposal(
        Ballot.Proposal memory _proposal,
        Ballot.Proposal memory _proposalToCompare
    ) internal pure {
        assertEq(_proposal.name, _proposalToCompare.name);
        assertEq(_proposal.voteCount, _proposalToCompare.voteCount);
    }

    function testVoter(
        Ballot.Voter memory _voter,
        Ballot.Voter memory _voterToCompare
    ) internal pure {
        assertEq(_voter.delegate, _voterToCompare.delegate);
        assertEq(_voter.vote, _voterToCompare.vote);
        assertEq(_voter.voted, _voterToCompare.voted);
        assertEq(_voter.weight, _voterToCompare.weight);
    }

    function initBallot() internal returns (Ballot) {
        bytes32[] memory propositions = new bytes32[](3);
        propositions[0] = YES_B32;
        propositions[1] = MAYBE_B32;
        propositions[2] = NO_B32;
        vm.prank(owner);
        ballotContract = new Ballot(propositions);
        return ballotContract;
    }
}

contract ConstructorTest is BallotTestHelper {
    function testInitialization() public {
        ballotContract = initBallot();
        assertEq(ballotContract.chairperson(), owner);
        (
            uint256 weight,
            bool voted,
            address delegate,
            uint256 vote
        ) = ballotContract.voters(owner);
        testVoter(
            Ballot.Voter(weight, voted, delegate, vote),
            Ballot.Voter(1, false, address(0), 0)
        );
        (bytes32 name, uint256 voteCount) = ballotContract.proposals(0);
        testProposal(
            Ballot.Proposal(name, voteCount),
            Ballot.Proposal(YES_B32, 0)
        );
        (name, voteCount) = ballotContract.proposals(1);
        testProposal(
            Ballot.Proposal(name, voteCount),
            Ballot.Proposal(MAYBE_B32, 0)
        );
        (name, voteCount) = ballotContract.proposals(2);
        testProposal(
            Ballot.Proposal(name, voteCount),
            Ballot.Proposal(NO_B32, 0)
        );
    }
}

contract GiveRightToVoteTest is BallotTestHelper {
    // Before each.
    function setUp() public {
        ballotContract = initBallot();
    }

    function testGiveRightToVote() public {
        vm.prank(owner);
        vm.expectEmit(true, false, false, false);
        emit GiveRight(addr1);
        ballotContract.giveRightToVote(addr1);
        (
            uint256 weight,
            bool voted,
            address delegate,
            uint256 vote
        ) = ballotContract.voters(addr1);
        testVoter(
            Ballot.Voter(weight, voted, delegate, vote),
            Ballot.Voter(1, false, address(0), 0)
        );
    }

    function testRevertWhenVoterWeightIsNot0() public {
        vm.startPrank(owner);
        ballotContract.giveRightToVote(addr1);
        vm.expectRevert();
        ballotContract.giveRightToVote(addr1);
        vm.stopPrank();
    }

    function testRevertWhenVoterAlreadyVoted() public {
        vm.prank(owner);
        ballotContract.giveRightToVote(addr1);
        vm.prank(addr1);
        ballotContract.vote(1);
        vm.prank(owner);
        vm.expectRevert("The voter already voted.");
        ballotContract.giveRightToVote(addr1);
    }

    function testRevertWhenSenderNotChairman() public {
        vm.prank(addr1);
        vm.expectRevert("Only chairperson can give right to vote.");
        ballotContract.giveRightToVote(addr1);
    }
}

contract DelegateTest is BallotTestHelper {
    // Before each.
    function setUp() public {
        ballotContract = initBallot();
    }

    function testDelegateAddWeight() public {
        vm.startPrank(owner);
        ballotContract.giveRightToVote(addr1);
        ballotContract.giveRightToVote(addr2);
        vm.stopPrank();
        vm.prank(addr1);
        vm.expectEmit(true, true, false, false);
        emit Delegate(addr1, addr2);
        ballotContract.delegate(addr2);
        (
            uint256 weight,
            bool voted,
            address delegate,
            uint256 vote
        ) = ballotContract.voters(addr1);
        testVoter(
            Ballot.Voter(weight, voted, delegate, vote),
            Ballot.Voter(1, true, addr2, 0)
        );
        (weight, voted, delegate, vote) = ballotContract.voters(addr2);
        testVoter(
            Ballot.Voter(weight, voted, delegate, vote),
            Ballot.Voter(2, false, address(0), 0)
        );
    }

    function testDelegateAddVote() public {
        vm.startPrank(owner);
        ballotContract.giveRightToVote(addr1);
        ballotContract.giveRightToVote(addr2);
        vm.stopPrank();
        vm.prank(addr2);
        ballotContract.vote(1);
        vm.prank(addr1);
        vm.expectEmit(true, true, false, false);
        emit Delegate(addr1, addr2);
        ballotContract.delegate(addr2);
        (
            uint256 weight,
            bool voted,
            address delegate,
            uint256 vote
        ) = ballotContract.voters(addr1);
        testVoter(
            Ballot.Voter(weight, voted, delegate, vote),
            Ballot.Voter(1, true, addr2, 0)
        );
        (weight, voted, delegate, vote) = ballotContract.voters(addr2);
        testVoter(
            Ballot.Voter(weight, voted, delegate, vote),
            Ballot.Voter(1, true, address(0), 1)
        );
        (bytes32 name, uint256 voteCount) = ballotContract.proposals(1);
        testProposal(
            Ballot.Proposal(name, voteCount),
            Ballot.Proposal(MAYBE_B32, 2)
        );
    }

    function testRevertWhenDelegationLoop() public {
        vm.startPrank(owner);
        ballotContract.giveRightToVote(addr1);
        ballotContract.giveRightToVote(addr2);
        ballotContract.giveRightToVote(addr3);
        vm.stopPrank();
        vm.prank(addr1);
        ballotContract.delegate(addr2);
        vm.prank(addr2);
        ballotContract.delegate(addr3);
        vm.prank(addr3);
        vm.expectRevert("Found loop in delegation.");
        ballotContract.delegate(addr1);
    }

    function testRevertWhenSelfDelegation() public {
        vm.prank(owner);
        ballotContract.giveRightToVote(addr1);
        vm.prank(addr1);
        vm.expectRevert("Self-delegation is disallowed.");
        ballotContract.delegate(addr1);
    }

    function testRevertWhenSenderAlreadyVoted() public {
        vm.prank(owner);
        ballotContract.giveRightToVote(addr1);
        vm.startPrank(addr1);
        ballotContract.vote(1);
        vm.expectRevert("You already voted.");
        ballotContract.delegate(addr2);
        vm.stopPrank();
    }
}

contract VoteTest is BallotTestHelper {
    // Before each.
    function setUp() public {
        ballotContract = initBallot();
    }

    function testVote() public {
        vm.prank(owner);
        ballotContract.giveRightToVote(addr1);
        vm.prank(addr1);
        vm.expectEmit(true, false, false, true);
        emit Vote(addr1, 1);
        ballotContract.vote(1);
        (
            uint256 weight,
            bool voted,
            address delegate,
            uint256 vote
        ) = ballotContract.voters(addr1);
        testVoter(
            Ballot.Voter(weight, voted, delegate, vote),
            Ballot.Voter(1, true, address(0), 1)
        );
        (bytes32 name, uint256 voteCount) = ballotContract.proposals(1);
        testProposal(
            Ballot.Proposal(name, voteCount),
            Ballot.Proposal(MAYBE_B32, 1)
        );
    }

    function testRevertWhenSenderAlreadyVoted() public {
        vm.prank(owner);
        ballotContract.giveRightToVote(addr1);
        vm.startPrank(addr1);
        ballotContract.vote(1);
        vm.expectRevert("Already voted.");
        ballotContract.vote(1);
        vm.stopPrank();
    }

    function testRevertWhenSenderNoRightToVote() public {
        vm.startPrank(addr1);
        vm.expectRevert("Has no right to vote");
        ballotContract.vote(1);
        vm.stopPrank();
    }
}

contract WinningProposalTest is BallotTestHelper {
    // Before each.
    function setUp() public {
        ballotContract = initBallot();
    }

    function testWinningProposalWinner() public {
        vm.startPrank(owner);
        ballotContract.giveRightToVote(addr1);
        ballotContract.giveRightToVote(addr2);
        vm.stopPrank();
        vm.prank(addr1);
        ballotContract.vote(1);
        vm.prank(addr2);
        ballotContract.vote(1);
        assertEq(ballotContract.winningProposal(), 1);
    }

    function testWinningProposalMajority() public {
        vm.startPrank(owner);
        ballotContract.giveRightToVote(addr1);
        ballotContract.giveRightToVote(addr2);
        ballotContract.giveRightToVote(addr3);
        vm.stopPrank();
        vm.prank(addr1);
        ballotContract.vote(1);
        vm.prank(addr2);
        ballotContract.vote(2);
        vm.prank(addr3);
        ballotContract.vote(2);
        assertEq(ballotContract.winningProposal(), 2);
    }

    function testWinningProposalDraw() public {
        vm.startPrank(owner);
        ballotContract.giveRightToVote(addr1);
        ballotContract.giveRightToVote(addr2);
        vm.stopPrank();
        vm.prank(addr1);
        ballotContract.vote(1);
        vm.prank(addr2);
        ballotContract.vote(2);
        assertEq(ballotContract.winningProposal(), 1);
    }
}

contract WinnerNameTest is BallotTestHelper {
    // Before each.
    function setUp() public {
        ballotContract = initBallot();
    }

    function testWinnerName() public {
        vm.startPrank(owner);
        ballotContract.giveRightToVote(addr1);
        ballotContract.giveRightToVote(addr2);
        vm.stopPrank();
        vm.prank(addr1);
        ballotContract.vote(1);
        vm.prank(addr2);
        ballotContract.vote(1);
        assertEq(ballotContract.winnerName(), MAYBE_B32);
    }

    function testAnotherWinnerName() public {
        vm.startPrank(owner);
        ballotContract.giveRightToVote(addr1);
        ballotContract.giveRightToVote(addr2);
        vm.stopPrank();
        vm.prank(addr1);
        ballotContract.vote(2);
        vm.prank(addr2);
        ballotContract.vote(2);
        assertEq(ballotContract.winnerName(), NO_B32);
    }
}
