// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {CommonBase} from "forge-std/Base.sol";
import {StdCheats} from "forge-std/StdCheats.sol";
import {StdUtils} from "forge-std/StdUtils.sol";
import {Ballot} from "@/contracts/Ballot.sol";

contract Handler is CommonBase, StdCheats, StdUtils {
    Ballot public ballotContract;

    constructor(Ballot _ballotContract) {
        ballotContract = _ballotContract;
    }

    function vote(uint256 _proposalId) public {
        ballotContract.vote(_proposalId);
    }

    // Added this to be excluded from coverage report.
    function test() public {}
}

contract ActorManager is CommonBase, StdCheats, StdUtils {
    Handler[] public handlers;
    uint256 public nbProposals;

    constructor(Handler[] memory _handlers, uint256 _nbProposals) {
        handlers = _handlers;
        nbProposals = _nbProposals;
    }

    function vote(uint256 _handlerIndex, uint256 _proposalId) public {
        _handlerIndex = bound(_handlerIndex, 0, handlers.length - 1);
        _proposalId = bound(_proposalId, 0, nbProposals - 1);
        handlers[_handlerIndex].vote(_proposalId);
    }

    // Added this to be excluded from coverage report.
    function test() public {}
}

contract InvariantTest is Test {
    ActorManager public manager;
    Handler[] public handlers;
    Ballot public ballotContract;
    uint256 public nbVoters = 50;
    uint256 public nbProposals = 6;

    // Before each.
    function setUp() public {
        bytes32[] memory propositions = new bytes32[](6);
        propositions[0] = bytes32("Yes");
        propositions[1] = bytes32("Maybe");
        propositions[2] = bytes32("No");
        propositions[3] = bytes32("What");
        propositions[4] = bytes32("Why");
        propositions[5] = bytes32("Obi Wan");
        ballotContract = new Ballot(propositions);
        for (uint256 i = 0; i < nbVoters; i++) {
            handlers.push(new Handler(ballotContract));
            ballotContract.giveRightToVote(address(handlers[i]));
        }
        manager = new ActorManager(handlers, nbProposals);
        targetContract(address(manager)); // Foundry shall target only this contract for invariant tests.
    }

    // The sum of each proposal voteCount should always be equal to the sum of each voter that did vote.
    function invariantTestSumProposalVoteCountEqSumVoterHasVoted() public view {
        uint256 sumVotersHasVoted;
        uint256 sumProposalsVoteCount;
        for (uint256 i = 0; i < nbVoters; i++) {
            (, bool voted, , ) = ballotContract.voters(address(handlers[i]));
            sumVotersHasVoted += voted ? 1 : 0;
        }
        for (uint256 i = 0; i < nbProposals; i++) {
            (, uint256 voteCount) = ballotContract.proposals(i);
            sumProposalsVoteCount += voteCount;
        }
        assertEq(sumVotersHasVoted, sumProposalsVoteCount);
    }

    // Added this to be excluded from coverage report.
    function test() public {}
}
