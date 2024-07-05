# Solidity API

## MintAmountZero

```solidity
error MintAmountZero()
```

Error thrown when the mint amount is zero.

## MintEmptyMetadata

```solidity
error MintEmptyMetadata()
```

Error thrown when the metadata to be set during mint is empty.

## TokenMetadataExists

```solidity
error TokenMetadataExists(uint256 tokenId)
```

Error thrown when trying to set metadata for an already existing token.

## TCO2

### _metadatas

```solidity
mapping(uint256 => string) _metadatas
```

### constructor

```solidity
constructor(address initialOwner, address royaltiesAddress) public
```

Constructor to initialize the contract with an initial owner.

_No ERC1155 uri is set because we override the uri function for on-chain metadata._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| initialOwner | address | The address of the initial owner of the contract. |
| royaltiesAddress | address |  |

### mint

```solidity
function mint(address account, uint256 id, uint256 amount, string base64Metadata) external
```

Mint a new token with the specified metadata.

_Mints a specified amount of tokens of a given id to the specified address._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address to mint the tokens to. |
| id | uint256 | The token id to mint. |
| amount | uint256 | The amount of tokens to mint. |
| base64Metadata | string | The metadata associated with the token, encoded in base64. |

### contractURI

```solidity
function contractURI() external pure returns (string)
```

Returns the contract-level metadata for the collection.

_This function returns a JSON string that contains metadata about the contract, formatted as a data URI._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | string A JSON string containing the contract metadata, including name, description, and images. |

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

Overrides the supportsInterface function to include ERC2981 (royalty standard) support.

_This function overrides `supportsInterface` to handle the ERC2981 interface check._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| interfaceId | bytes4 | The interface identifier, as specified in ERC-165. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool True if the contract implements the requested interface, false otherwise. |

### uri

```solidity
function uri(uint256 tokenId) public view returns (string)
```

Overrides the URI function to provide on-chain token-specific metadata.

_This function returns the metadata URI for a given token id._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The token id to get the metadata URI for. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | string The metadata URI for the given token id. |

### _getSvg

```solidity
function _getSvg() internal pure returns (string)
```

Generates CarbonThink logo SVG image as a string.

_This function generates an SVG image with specific attributes and returns it as a string._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | string A string representing the SVG image. |

### _update

```solidity
function _update(address from, address to, uint256[] ids, uint256[] values) internal
```

Override required by Solidity for token transfer updates.

_This function overrides the required update function to handle token transfers._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | The address to transfer tokens from. |
| to | address | The address to transfer tokens to. |
| ids | uint256[] | The ids of the tokens to transfer. |
| values | uint256[] | The amounts of the tokens to transfer. |

