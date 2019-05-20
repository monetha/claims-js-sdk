# Monetha: Decentralized Reputation Framework

## Dispute resolution: js-sdk

A javascript SDK for resolving disputes in a decentralized way using Ethereum blockchain.

- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Adding to your project](#adding-to-your-project)
- [Usage](#usage)
  - [Example](#example)
  - [Preparing claim manager](#preparing-claim-manager)
  - [Creating dispute](#creating-dispute)
  - [Getting dispute](#getting-dispute)
  - [Accepting dispute](#accepting-dispute)
  - [Resolving dispute](#resolving-dispute)
  - [Closing dispute](#closing-dispute)
  - [Checking and modifying MTH allowance](#checking-and-modifying-mth-allowance)
- [Contributing](#contributing)

## Installation

### Prerequisites

- Node.js 8+
- [web3.js](https://www.npmjs.com/package/web3) (1.0.0+) in your project
- [bignumber.js](https://www.npmjs.com/package/big-number) in your project

### Adding to your project

```
npm install git+https://github.com/monetha/claims-js-sdk.git --save
```

## Usage

In order to better understand the use cases of the `claims-sdk` please refer to [Monetha Payment layer: Dispute resolution](https://github.com/monetha/payment-layer#dispute-resolution).

### Example

There is an [example app](https://github.com/monetha/claims-js-sdk-example) which demonstrates full flow of dispute resolution using the SDK. It is useful to get better understanding of how dispute resolution works and how to use claims SDK in code.

### Preparing claim manager

SDK provides a class `ClaimManager` for dispute management. It can be used to execute all needed operations in dispute resolution flow. Instantiate this class like this:

```javascript
import Web3 from 'web3';
import { ClaimManager } from 'claims-sdk';

// web3 can come from your context
const web3 = new Web3(new Web3.providers.HttpProvider('ETHEREUM_NODE_ADDRESS'));

const claimManager = new ClaimManager({
  claimsHandlerContractAddress: 'CLAIMS_HANDLER_CONTRACT_ADDRESS',
  monethaTokenContractAddress: 'MONETHA_TOKEN_CONTRACT_ADDRESS',
  web3,
});
```

where:
- `ETHEREUM_NODE_ADDRESS` - Ethereum network node RPC url
- `CLAIMS_HANDLER_CONTRACT_ADDRESS` - ClaimsHandler contract address (get address [here](https://github.com/monetha/payment-layer/blob/master/README.md#claim-handler-contract-addresses))
- `MONETHA_TOKEN_CONTRACT_ADDRESS` - MonethaToken contract address (get address [here](#monetha-token-contract-addresses))

#### Monetha token contract addresses

| Network      | Address                                      |
|--------------|----------------------------------------------|
|Ropsten|[0x46917fcca9dfe441675535fc422dcd6c1b2824f9](https://etherscan.io/address/0x46917fcca9dfe441675535fc422dcd6c1b2824f9)|
|Mainnet|[0xaF4DcE16Da2877f8c9e00544c93B62Ac40631F16](https://etherscan.io/address/0xaF4DcE16Da2877f8c9e00544c93B62Ac40631F16)|

### Creating dispute

To create a dispute use `claimManager.createTx(claimInfo)`:

```javascript
import { /*...*/ getClaimIdFromCreateTXReceipt } from 'claims-sdk';

/*...*/

const tx = claimManager.createTx({
    // Id of deal which dispute is being opened for (i.e. order ID in your e-shop)
    dealId: 123,

    // Description of the reason for the dispute
    reason: 'I have received a defected product',

    // Dispute requester's id (i.e. e-shop buyer's ID)
    requesterId: 'user-1',

    // Dispute respondent's id (i.e. e-shop seller's ID)
    respondentId: 'user-2',

    // Amount of MTH tokens to stake (minimum 150)
    tokens: new BigNumber(150);
});

// claimManager only returns TransactionObject to execute, but does not execute it itself.
// Your code must implement `sendAndWaitTx` or similar function which executes transaction including estimation of transaction fees.
// Returned transaction object contains:
// - `estimateGas()` method (requires `from` field when you deal with `ClaimsHandler` contract)
// - `encodeABI()` method which returns transaction data as a string
// To see an example implementation of sendAndWaitTx, go to https://github.com/monetha/claims-js-sdk-example/blob/master/src/components/App/index.tsx#L459
const receipt = await sendAndWaitTx(walletAddress, contractAddress, tx);

// `getClaimIdFromCreateTXReceipt` helper allows us extracting claim ID from transaction receipt
const claimId = getClaimIdFromCreateTXReceipt(receipt);
```

***NOTE:*** In order for creation transaction to succeed - ensure there is enough allowance in Monetha token contract to transfer specified amount of MTH tokens in stake from your (requester's) wallet to Claim handler contract. You can check and modify allowance using this SDK. See [here](#checking-and-modifying-mth-allowance).

### Getting dispute

To get a dispute use `claimManager.getClaim(claimId)`:

```javascript
const claimId = 123; // Claim ID comes from dispute creation step

const claim = claimManager.getClaim(claimId);
```

### Accepting dispute

To accept a dispute use `claimManager.acceptTx(claimId)`:

```javascript
const claimId = 123; // Claim ID comes from dispute creation step

const tx = claimManager.acceptTx(claimId);

// Estimate gas and then execute transaction
// ...
```

***NOTE:*** In order for acceptance transaction to succeed - ensure there is enough allowance in Monetha token contract to transfer staked amount of MTH tokens from your (respondent's) wallet to Claim handler contract. You can check and modify allowance using this SDK. See [here](#checking-and-modifying-mth-allowance).

### Resolving dispute

To resolve a dispute use `claimManager.resolveTx(claimId, resolution)`:

```javascript
const claimId = 123; // Claim ID comes from dispute creation step
const resolution = 'I will send you a replacement';

const tx = claimManager.resolveTx(claimId, resolution);

// Estimate gas and then execute transaction
// ...
```

### Closing dispute

To close a dispute use `claimManager.closeTx(claimId)`:

```javascript
const claimId = 123; // Claim ID comes from dispute creation step

const tx = claimManager.closeTx(claimId);

// Estimate gas and then execute transaction
// ...
```

### Checking and modifying MTH allowance

In order to successfully execute a transaction which stakes MTH tokens, there must be enough allowance in Monetha token contract.

To check allowance for a wallet, use `claimManager.getAllowance(walletAddress)`:

```javascript
const allowance = await claimManager.getAllowance(walletAddress);
```

If existing allowance is lower than the amount of tokens you want to stake, you have to modify it. First you must clear existing allowance (in case it is more than 0) by using `claimManager.clearAllowanceTx()`:

```javascript
const tx = claimManager.clearAllowanceTx();

// Execute transaction using the wallet you want to clear allowance for
// ...
```

If existing allowance is 0, we can assign new allowance with `claimManager.allowTx(newAllowance)`:
```javascript
const newAllowance = new BigNumber(150);

const tx = claimManager.allowTx(newAllowance);

// Executes transaction (no need to estimate gas and call the contract) using the wallet you want to modify allowance for
// ...
```

## Contributing

Thank you for considering to help out with the source code! We welcome contributions from anyone on the internet, and are grateful for even the smallest of fixes! If you'd like to contribute to `claims-sdk`, please fork, fix, commit and send a pull request for the maintainers to review and merge into the main code base.  Feel free to register issues and suggestions.

#### Contracts update

This SDK is dependent on [Monetha's claim handler contract](https://github.com/monetha/loyalty-contracts/blob/master/contracts/MonethaClaimHandler.sol). In case if contract will be updated and method signatures will change, `src/contracts/MonethaClaimHandler.ts` file needs to be re-generated. To do so follow the steps below:

1. Copy `MonethaClaimHandler.abi` and `MonethaClaimHandler.sol` files of latest release zip in [releases](https://github.com/monetha/loyalty-contracts/releases) to `src/contracts` folder.
2. Run `npm run prepare-contracts` to convert Ethereum contract into TypeScript file.
3. Commit new/updated files.

#### Running integration tests

SDK has integration tests. Please be sure that after all changes integration tests are passing. 
Read [here](https://github.com/monetha/claims-js-sdk/integration-tests) how to run and manage integration tests. 
