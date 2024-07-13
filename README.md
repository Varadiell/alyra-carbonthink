[![CI Tests](https://github.com/Varadiell/alyra-carbonthink/actions/workflows/ci-tests.yml/badge.svg?branch=main)](https://github.com/Varadiell/alyra-carbonthink/actions/workflows/ci-tests.yml)

# CarbonThink - Alyra
## The complete platform for Carbon Credits emission.

Live Demo: https://alyra-carbonthink.vercel.app/ - Base Sepolia

See live NFTs on testnet marketplaces:
- https://testnets.opensea.io/collection/carbonthink-tco2-10
- https://testnet.rarible.com/collection/base/0xEB94EeD2557f312C65dC03d2d7347e102de23689/items

See smart contracts on Base Sepolia:
- [TCO2 token contract](https://sepolia.basescan.org/address/0xEB94EeD2557f312C65dC03d2d7347e102de23689)
- [ProjectManager contract](https://sepolia.basescan.org/address/0xb13498d53f71fc4c0819fb365816539f8d6822bc)

Initial Specifications: [PDF](/specifications/CarbonThink%20-%20Specifications.pdf) - Made with LaTeX

Alyra's Project Report: [PDF](/specifications/CarbonThink%20-%20Alyra%20-%20Carnet%20de%20Projet%20RS6515.pdf)


## CI/CD

Enabled CI/CD (on Vercel's end) that checks each commit for both frontend and backend repositories and automatically deploys the project:
- backend-lint
- frontend-lint
- backend-tests-hardhat
- slither
- codespell

Githooks that checks on pre-commit that everything seems to be fine:
- pnpm lint
- pnpm cspell
- hardhat unit tests

## Contracts Unit Test Coverage at 100%

File                 |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
---------------------|----------|----------|----------|----------|----------------|
 contracts\          |      100 |      100 |      100 |      100 |                |
  ProjectManager.sol |      100 |      100 |      100 |      100 |                |
  TCO2.sol           |      100 |      100 |      100 |      100 |                |
All files            |      100 |      100 |      100 |      100 |                |

## Screenshots

> Project Details
![image](https://github.com/user-attachments/assets/7e565afd-3edb-4c18-bebe-c458a0ac5186)

> Project List
![image](https://github.com/user-attachments/assets/7e897b70-814f-4120-a70f-e2bf9917f93d)

> Dashboard
![image](https://github.com/user-attachments/assets/86f674cd-98b3-4c91-b21c-44ef608f5db8)

> Burn Page
![image](https://github.com/user-attachments/assets/bbe4243a-141f-4454-a008-c94ac7782ad2)

## Marketplaces

> OpenSea, NFT info view with Metadata.
![image](https://github.com/user-attachments/assets/4f312e87-2677-46e5-8449-48faecb0791f)

> Rarible, collection view.
![image](https://github.com/user-attachments/assets/e4b07d68-f6dd-4054-be38-cbdc01268f37)

------------------------------

## Backend install

```
$ cd backend
$ pnpm install
```

Install Foundry
```
$ curl -L https://foundry.paradigm.xyz | bash
```

## Frontend install

```
$ cd frontend
$ pnpm install
```

## Githooks

Check that your core.hookspath is ".githooks"
```
$ git config --local core.hooksPath
```

Else, set value to ".githooks"
```
$ git config --local core.hooksPath .githooks
```
