# Hardhat

Deploy contract on localhost:
```
$ pnpm hardhat node
$ pnpm hardhat ignition deploy ignition/modules/TCO2.ts --network localhost
```

Deploy contract on Base testnet (Sepolia):
```
$ pnpm hardhat ignition deploy ignition/modules/TCO2.ts --network baseSepolia
```

Deploy contract on Base mainnet:
```
$ pnpm hardhat ignition deploy ignition/modules/TCO2.ts --network baseMainnet
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
