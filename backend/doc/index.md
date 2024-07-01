# Solidity API

## TCO2

### constructor

```solidity
constructor(address initialAuthority) public
```

### mint

```solidity
function mint(address account, uint256 id, uint256 amount, bytes data) public
```

### mintBatch

```solidity
function mintBatch(address to, uint256[] ids, uint256[] amounts, bytes data) public
```

### _update

```solidity
function _update(address from, address to, uint256[] ids, uint256[] values) internal
```

