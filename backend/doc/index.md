# Solidity API

## ProjectManager

This contract manages projects and mints TCO2 tokens based on the projects' data.

### AddressZero

```solidity
error AddressZero()
```

Emitted when the zero address is provided where it is not allowed.

### CannotChangeProjectState

```solidity
error CannotChangeProjectState()
```

Emitted when the project state cannot be altered.

### CannotMintZeroToken

```solidity
error CannotMintZeroToken()
```

Emitted when attempting to mint zero tokens.

### InactiveProject

```solidity
error InactiveProject()
```

Emitted when an action is attempted on an inactive project.

### InvalidMetadata

```solidity
error InvalidMetadata()
```

Emitted when invalid metadata is provided.

### ProjectDoesNotExist

```solidity
error ProjectDoesNotExist()
```

Emitted when a project does not exist.

### DocumentAdded

```solidity
event DocumentAdded(uint256 projectId)
```

Emitted when a document is added to a project.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| projectId | uint256 | The ID of the project. |

### PhotoAdded

```solidity
event PhotoAdded(uint256 projectId)
```

Emitted when a photo is added to a project.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| projectId | uint256 | The ID of the project. |

### Created

```solidity
event Created(uint256 projectId)
```

Emitted when a project is created.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| projectId | uint256 | The ID of the created project. |

### Minted

```solidity
event Minted(uint256 projectId, address account, uint256 amount)
```

Emitted when tokens are minted for a project.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| projectId | uint256 | The ID of the project. |
| account | address | The account receiving the minted tokens. |
| amount | uint256 | The amount of tokens minted. |

### StatusChanged

```solidity
event StatusChanged(uint256 projectId, enum ProjectManager.Status status)
```

Emitted when the status of a project changes.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| projectId | uint256 | The ID of the project. |
| status | enum ProjectManager.Status | The new status of the project. |

### Status

The possible statuses of a project.

_Once the status is either "Canceled" or "Completed", it can not be altered anymore._

```solidity
enum Status {
  Canceled,
  Pending,
  Active,
  Completed
}
```

### CreateParams

Represents the details of a new project to be created.

_This structure is used to store the initial information for a new project._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |

```solidity
struct CreateParams {
  address projectHolder;
  string name;
  string description;
  string externalUrl;
  string image;
  struct ProjectManager.ProjectData data;
}
```

### Project

The structure representing a project.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |

```solidity
struct Project {
  bool isRegistered;
  address projectHolder;
  uint256 id;
  string name;
  string description;
  string externalUrl;
  string image;
  string[] photoUrls;
  string[] documentUrls;
  struct ProjectManager.ProjectData data;
  enum ProjectManager.Status status;
}
```

### ProjectData

The detailed data of a project.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |

```solidity
struct ProjectData {
  uint8 duration;
  uint64 ares;
  uint64 expectedCo2Tons;
  uint64 startDate;
  string continent;
  string country;
  string region;
  string province;
  string city;
  string location;
  string coordinates;
  string plantedSpecies;
  string calculationMethod;
  uint8[] unSDGs;
}
```

### securityFund

```solidity
address securityFund
```

The address of the security fund.

### tco2Contract

```solidity
contract TCO2 tco2Contract
```

The TCO2 contract instance.

### totalProjects

```solidity
uint256 totalProjects
```

The total number of projects.

### _projects

```solidity
mapping(uint256 => struct ProjectManager.Project) _projects
```

The mapping of project IDs to projects.

### exists

```solidity
modifier exists(uint256 _projectId)
```

Ensures the project exists.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _projectId | uint256 | The ID of the project. |

### notInactive

```solidity
modifier notInactive(uint256 _projectId)
```

Ensures the project is not inactive (Canceled or Completed).

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _projectId | uint256 | The ID of the project. |

### constructor

```solidity
constructor(address _initialOwner, address _securityFund, address _tco2Contract) public
```

Initializes the contract with the given parameters.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _initialOwner | address | The initial owner of the contract. |
| _securityFund | address | The address of the security fund. |
| _tco2Contract | address | The address of the TCO2 contract. |

### addDocument

```solidity
function addDocument(uint256 projectId, string documentUrl) external
```

Adds a document URL (stored with IPFS) to the project.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| projectId | uint256 | The ID of the project. |
| documentUrl | string | The IPFS URL of the document to add. |

### addPhoto

```solidity
function addPhoto(uint256 projectId, string photoUrl) external
```

Adds a photo URL (stored with IPFS) to the project.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| projectId | uint256 | The ID of the project. |
| photoUrl | string | The URL of the photo to add. |

### create

```solidity
function create(struct ProjectManager.CreateParams newProject) external
```

Creates a new project.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newProject | struct ProjectManager.CreateParams | The project data (see "CreateParams" struct). |

### get

```solidity
function get(uint256 projectId) external view returns (struct ProjectManager.Project)
```

Returns the project details.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| projectId | uint256 | The ID of the project. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct ProjectManager.Project | Project The project details. |

### mintTokens

```solidity
function mintTokens(uint256 projectId, uint256 amount, string base64Metadata) external
```

Mints TCO2 tokens for the given project.

_Do not include metadata when the project already has minted tokens._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| projectId | uint256 | The ID of the project. |
| amount | uint256 | The amount of tokens to mint. |
| base64Metadata | string | The metadata associated with the tokens, as a base64 string. |

### setStatus

```solidity
function setStatus(uint256 projectId, enum ProjectManager.Status status) external
```

Sets the status of the project.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| projectId | uint256 | The ID of the project. |
| status | enum ProjectManager.Status | The new status of the project. |

### _get

```solidity
function _get(uint256 projectId) internal view returns (struct ProjectManager.Project)
```

Retrieves the project details for the given project ID.

_This is an internal function to get project details._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| projectId | uint256 | The ID of the project. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct ProjectManager.Project | Project The project details stored in the contract. |

### _splitMint

```solidity
function _splitMint(uint256 totalAmount, uint8 splitPercent) internal pure returns (uint256, uint256)
```

Splits the total amount into two parts based on the split percentage.

_The function ensures that the total amount is properly divided between the receiver and the security fund.
The receiver will always receive more than the security fund when the amount to be shared is not a round number._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| totalAmount | uint256 | The total amount to be split. |
| splitPercent | uint8 | The percentage to allocate to the security fund. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | receiverAmount The amount allocated to the receiver. |
| [1] | uint256 | securityFundAmount The amount allocated to the security fund. |

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

