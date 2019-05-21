const expect = require('chai').expect;
const chai = require('chai');
chai.use(require('chai-moment'));
const Web3 = require('web3');
const bignumber = require('bignumber.js');
const sdk = require('../../dist');
const MIN_STAKE = 15000000; // 150 MTH
const helper = require("./helpers/truffleTestHelper");

let OWNER;
let MONETHA_ACCOUNT;
let REQUESTER;
let RESPONDENT;
let OTHER;
let token;
let claimHandler;
let claimManager;
let claimId;

const MonethaClaimHandler = artifacts.require("MonethaClaimHandler");
const Token = artifacts.require("ERC20Mintable");

const ethereumNetworkUrl = 'http://127.0.0.1:8545';
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumNetworkUrl));

before('Deploy Monetha Claim Handler contract and prepare accounts', async () => {
    const accounts = await web3.eth.getAccounts();

    OWNER = accounts[0];
    MONETHA_ACCOUNT = accounts[2];
    REQUESTER = accounts[3];
    RESPONDENT = accounts[4];
    OTHER = accounts[5];

    token = await Token.new({ from: OWNER });
    await token.mint(REQUESTER, 100 * MIN_STAKE, { from: OWNER });
    await token.mint(RESPONDENT, 100 * MIN_STAKE, { from: OWNER });

    claimHandler = await MonethaClaimHandler.new(token.address, MIN_STAKE, { from: OWNER });
    await claimHandler.setMonethaAddress(MONETHA_ACCOUNT, true, { from: OWNER });
})

describe('Claims js-sdk smoke tests', function () {
    it('Should be able to prepare claim manager', async () => {
        claimManager = new sdk.ClaimManager({
            claimsHandlerContractAddress: claimHandler.address,
            monethaTokenContractAddress: token.address,
            web3,
        });
        expect(claimManager).to.have.property('claimHandler');
    });

    it('Requester should be able to stake MTH tokens', async () => {
        // Given
        const newAllowance = new bignumber.BigNumber(1500);
        // When
        const tx_data = claimManager.allowTx(newAllowance);
        const tx = await submitTransaction(tx_data, REQUESTER);
        // Then
        expect(tx.to.toLowerCase()).to.equal(token.address);
        expect(tx).to.have.property('input');
    });

    it('Requester should be able to create dispute', async () => {
        // Given
        const dealid = 123;
        const reason = 'I have received a defected product';
        const requesterId = 'user-1';
        const respondentId = 'user-2';
        const tokens = new bignumber.BigNumber(150);
        // When
        const tx_data = claimManager.createTx({
            dealId: dealid,
            reason: reason,
            requesterId: requesterId,
            respondentId: respondentId,
            tokens: tokens
        });
        const tx = await submitTransaction(tx_data, REQUESTER);
        // Then
        expect(tx.to.toLowerCase()).to.equal(claimHandler.address);
        expect(tx).to.have.property('input');

        const receipt = await web3.eth.getTransactionReceipt(tx.hash);
        claimId = sdk.getClaimIdFromCreateTXReceipt(receipt);
    });

    it('Respondent should be able to stake MTH tokens', async () => {
        // Given
        const newAllowance = new bignumber.BigNumber(150);
        // When
        const tx_data = claimManager.allowTx(newAllowance);
        const tx = await submitTransaction(tx_data, RESPONDENT);
        // Then
        expect(tx.to.toLowerCase()).to.equal(token.address);
        expect(tx).to.have.property('input');
    });

    it('Respondent should be able to accept dispute', async () => {
        // Given
        // When
        const tx_data = claimManager.acceptTx(claimId);
        const tx = await submitTransaction(tx_data, RESPONDENT);
        // Then
        expect(tx.to.toLowerCase()).to.equal(claimHandler.address);
        expect(tx).to.have.property('input');
    });

    it('Respondent should be able to resolve dispute', async () => {
        // Given
        const resolution = 'This is dispute resolution';
        // When
        const tx_data = claimManager.resolveTx(claimId, resolution);
        const tx = await submitTransaction(tx_data, RESPONDENT);
        // Then
        expect(tx.to.toLowerCase()).to.equal(claimHandler.address);
        expect(tx).to.have.property('input');
    });

    it('Requester should be able to close dispute', async () => {
        // Given
        // When
        const tx_data = claimManager.closeTx(claimId);
        const tx = await submitTransaction(tx_data, REQUESTER);
        // Then
        expect(tx.to.toLowerCase()).to.equal(claimHandler.address);
        expect(tx).to.have.property('input');
    });
});

async function submitTransaction(tx_data, from) {
    const gas = await tx_data.estimateGas({from});
    const txConfig = {
        from,
        to: tx_data.contractAddress,
        nonce: await web3.eth.getTransactionCount(from), // get correct nonce
        gasPrice: await web3.eth.getGasPrice(),
        gas,
        value: '0x0',
        data: tx_data.encodeABI(),
    };

    return new Promise(async (success, reject) => {
        try {
            await web3.eth.sendTransaction(txConfig)
              .on('transactionHash', async hash => {
                  const transaction = await web3.eth.getTransaction(hash);
                  success(transaction);
              })
        } catch (e) {
            reject(e);
        }
    });
}
