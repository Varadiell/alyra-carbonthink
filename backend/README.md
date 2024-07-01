# Hardhat

Deploy contract on localhost:
```
$ pnpm hardhat node
$ pnpm hardhat ignition deploy ignition/modules/TCO2.ts --network localhost
```

Deploy contract on Polygon zkEVM testnet (Cardona):
```
$ pnpm hardhat ignition deploy ignition/modules/TCO2.ts --network polygonZkEvmCardona
```

Deploy contract on Polygon zkEVM mainnet:
```
$ pnpm hardhat ignition deploy ignition/modules/TCO2.ts --network polygonZkEvm
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
