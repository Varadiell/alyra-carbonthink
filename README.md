[![CI Tests](https://github.com/Varadiell/alyra-carbonthink/actions/workflows/ci-tests.yml/badge.svg?branch=main)](https://github.com/Varadiell/alyra-carbonthink/actions/workflows/ci-tests.yml)

# dapp-boilerplate

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
