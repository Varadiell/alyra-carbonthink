# Solidity API

## Ballot

_Implements voting process along with vote delegation_

### GiveRight

```solidity
event GiveRight(address voter)
```

### Delegate

```solidity
event Delegate(address from, address to)
```

### Vote

```solidity
event Vote(address voter, uint256 proposal)
```

### Voter

```solidity
struct Voter {
  uint256 weight;
  bool voted;
  address delegate;
  uint256 vote;
}
```

### Proposal

```solidity
struct Proposal {
  bytes32 name;
  uint256 voteCount;
}
```

### chairperson

```solidity
address chairperson
```

### voters

```solidity
mapping(address => struct Ballot.Voter) voters
```

### proposals

```solidity
struct Ballot.Proposal[] proposals
```

### constructor

```solidity
constructor(bytes32[] proposalNames) public
```

_Create a new ballot to choose one of 'proposalNames'._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| proposalNames | bytes32[] | names of proposals |

### giveRightToVote

```solidity
function giveRightToVote(address voter) public
```

_Give 'voter' the right to vote on this ballot. May only be called by 'chairperson'._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| voter | address | address of voter |

### delegate

```solidity
function delegate(address to) public
```

_Delegate your vote to the voter 'to'._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | address to which vote is delegated |

### vote

```solidity
function vote(uint256 proposal) public
```

_Give your vote (including votes delegated to you) to proposal 'proposals[proposal].name'._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| proposal | uint256 | index of proposal in the proposals array |

### winningProposal

```solidity
function winningProposal() public view returns (uint256 winningProposal_)
```

_Computes the winning proposal taking all previous votes into account._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| winningProposal_ | uint256 | index of winning proposal in the proposals array |

### winnerName

```solidity
function winnerName() public view returns (bytes32 winnerName_)
```

_Calls winningProposal() function to get the index of the winner contained in the proposals array and then_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| winnerName_ | bytes32 | the name of the winner |

