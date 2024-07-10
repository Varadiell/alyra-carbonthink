import { base, baseSepolia, hardhat } from 'viem/chains';

export const projectManager = (chainId: number) => {
  const address: Record<string, `0x${string}`> = {
    [hardhat.id]: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    [baseSepolia.id]: '0x652Bc061a197a6D43467D62C525D6E9Ca96FB6cE',
    [base.id]: '0x', // TODO: put base mainnet address here
  };

  const fromBlock: Record<string, bigint> = {
    [hardhat.id]: BigInt(0),
    [baseSepolia.id]: BigInt(12312205),
    [base.id]: BigInt(0), // TODO: put base mainnet fromBlock here
  };

  return {
    abi,
    address: chainId ? address[chainId] : address[baseSepolia.id],
    fromBlock: chainId ? fromBlock[chainId] : fromBlock[baseSepolia.id],
  };
};

const abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_initialOwner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_securityFund',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_tco2Contract',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'AddressZero',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CannotChangeProjectState',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CannotMintZeroToken',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InactiveProject',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidMetadata',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MintOnActiveStatusOnly',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ProjectDoesNotExist',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SameStatus',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'projectId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Created',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'projectId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'DocumentAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'projectId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Minted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'projectId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'PhotoAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'projectId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'enum ProjectManager.Status',
        name: 'status',
        type: 'uint8',
      },
    ],
    name: 'StatusChanged',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'projectId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'documentUrl',
        type: 'string',
      },
    ],
    name: 'addDocument',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'projectId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'photoUrl',
        type: 'string',
      },
    ],
    name: 'addPhoto',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'projectHolder',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'description',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'externalUrl',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'image',
            type: 'string',
          },
          {
            components: [
              {
                internalType: 'uint8',
                name: 'duration',
                type: 'uint8',
              },
              {
                internalType: 'uint64',
                name: 'ares',
                type: 'uint64',
              },
              {
                internalType: 'uint64',
                name: 'expectedCo2Tons',
                type: 'uint64',
              },
              {
                internalType: 'uint64',
                name: 'startDate',
                type: 'uint64',
              },
              {
                internalType: 'string',
                name: 'continent',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'country',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'region',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'province',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'city',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'location',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'coordinates',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'plantedSpecies',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'calculationMethod',
                type: 'string',
              },
              {
                internalType: 'uint8[]',
                name: 'unSDGs',
                type: 'uint8[]',
              },
            ],
            internalType: 'struct ProjectManager.ProjectData',
            name: 'data',
            type: 'tuple',
          },
        ],
        internalType: 'struct ProjectManager.CreateParams',
        name: 'newProject',
        type: 'tuple',
      },
    ],
    name: 'create',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'projectId',
        type: 'uint256',
      },
    ],
    name: 'get',
    outputs: [
      {
        components: [
          {
            internalType: 'bool',
            name: 'isRegistered',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'projectHolder',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'description',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'externalUrl',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'image',
            type: 'string',
          },
          {
            internalType: 'string[]',
            name: 'photoUrls',
            type: 'string[]',
          },
          {
            internalType: 'string[]',
            name: 'documentUrls',
            type: 'string[]',
          },
          {
            components: [
              {
                internalType: 'uint8',
                name: 'duration',
                type: 'uint8',
              },
              {
                internalType: 'uint64',
                name: 'ares',
                type: 'uint64',
              },
              {
                internalType: 'uint64',
                name: 'expectedCo2Tons',
                type: 'uint64',
              },
              {
                internalType: 'uint64',
                name: 'startDate',
                type: 'uint64',
              },
              {
                internalType: 'string',
                name: 'continent',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'country',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'region',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'province',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'city',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'location',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'coordinates',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'plantedSpecies',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'calculationMethod',
                type: 'string',
              },
              {
                internalType: 'uint8[]',
                name: 'unSDGs',
                type: 'uint8[]',
              },
            ],
            internalType: 'struct ProjectManager.ProjectData',
            name: 'data',
            type: 'tuple',
          },
          {
            internalType: 'enum ProjectManager.Status',
            name: 'status',
            type: 'uint8',
          },
        ],
        internalType: 'struct ProjectManager.Project',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'projectId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'base64Metadata',
        type: 'string',
      },
    ],
    name: 'mintTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'securityFund',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'projectId',
        type: 'uint256',
      },
      {
        internalType: 'enum ProjectManager.Status',
        name: 'status',
        type: 'uint8',
      },
    ],
    name: 'setStatus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tco2Contract',
    outputs: [
      {
        internalType: 'contract TCO2',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalProjects',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
