# Hardhat

Deploy contract on localhost:
```
$ pnpm hardhat node
$ pnpm hardhat ignition deploy ignition/modules/ProjectManager.ts --network localhost --parameters ignition/parameters-localhost.json
```

Deploy contract on Ethereum testnet (Sepolia):
```
$ pnpm hardhat ignition deploy ignition/modules/ProjectManager.ts --network ethSepolia --verify
```

Deploy contract on Base testnet (Sepolia):
```
$ pnpm hardhat ignition deploy ignition/modules/ProjectManager.ts --network baseSepolia --verify
```

Deploy contract on Base mainnet:
```
$ pnpm hardhat ignition deploy ignition/modules/ProjectManager.ts --network baseMainnet --verify
```

Run hardhat tests with coverage
```
$ pnpm hardhat coverage
```

# Foundry

Run foundry tests with coverage
```
$ forge coverage
```

# Slither

Install Slither
```
$ python3 --version
$ pip3 --version
$ python3 -m pip install slither-analyzer
```
