"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bignumber_js_1 = require("bignumber.js");
var conversion_1 = require("../utils/conversion");
var validation_1 = require("../utils/validation");
var claimsHandlerContractAbi = require("../contracts/MonethaClaimHandler.json");
var monethaTokenContractAbi = require("../contracts/MonethaToken.json");
// #endregion
/**
 * Allows managing disputes on Ethereum blockchain
 */
var ClaimManager = /** @class */ (function () {
    function ClaimManager(options) {
        validation_1.validateNotEmpty(options, 'options');
        var web3 = options.web3, claimsHandlerContractAddress = options.claimsHandlerContractAddress, monethaTokenContractAddress = options.monethaTokenContractAddress;
        validation_1.validateNotEmpty(web3, 'options.web3');
        validation_1.validateNotEmpty(claimsHandlerContractAddress, 'options.claimsHandlerContractAddress');
        validation_1.validateNotEmpty(monethaTokenContractAddress, 'options.monethaTokenContractAddress');
        this.claimHandler = new web3.eth.Contract(claimsHandlerContractAbi, claimsHandlerContractAddress);
        this.monethaToken = new web3.eth.Contract(monethaTokenContractAbi, monethaTokenContractAddress);
    }
    // #region -------------- Dispute actions -------------------------------------------------------------------
    /**
     * Creates transaction for opening a dispute.
     * This transaction stores information about problem to blockchain and and transfers staked amount of MTH tokens from user's (requester's)
     * wallet to claims handler contract.
     *
     * IMPORTANT: Transaction will only succeed if Monetha token contract has enough allowance to transfer staked MTH tokens from user's
     * wallet to claims handler contract. You can check existing allowance by calling `getAllowance` method and approve allowance by `allowTx`
     */
    ClaimManager.prototype.createTx = function (payload) {
        validation_1.validateNotEmpty(payload, 'payload');
        var dealId = payload.dealId, reason = payload.reason, requesterId = payload.requesterId, respondentId = payload.respondentId, tokens = payload.tokens;
        validation_1.validateNotEmpty(dealId, 'payload.dealId');
        validation_1.validateNotEmpty(reason, 'payload.reason');
        validation_1.validateNotEmpty(requesterId, 'payload.requesterId');
        validation_1.validateNotEmpty(respondentId, 'payload.respondentId');
        validation_1.validateNotEmpty(tokens, 'payload.tokens');
        var bcTokens = conversion_1.floatTokensToBlockchain(new bignumber_js_1.default(tokens)).toString();
        var tx = this.claimHandler.methods.create(dealId, '0x1', reason, requesterId, respondentId, bcTokens);
        return tx;
    };
    /**
     * Creates transaction for accepting a dispute.
     * This transaction transfers staked amount of MTH tokens from user's (respondent's)
     * wallet to claims handler contract. In other words - it 'matches'  the same amount of tokens which was staked by requester.
     *
     * Claim must be in `AwaitingAcceptance` state before executing this transaction and can only be executed by respondent.
     *
     * IMPORTANT: Transaction will only succeed if Monetha token contract has enough allowance to transfer staked MTH tokens from user's
     * wallet to claims handler contract. You can check existing allowance by calling `getAllowance` method and approve allowance by `allowTx`
     */
    ClaimManager.prototype.acceptTx = function (claimId) {
        validation_1.validateNotEmpty(claimId, 'claimId');
        var tx = this.claimHandler.methods.accept(claimId);
        return tx;
    };
    /**
     * Creates transaction for resolving a dispute.
     * This transaction stores resolution note to blockchain and transfers respondent's staked MTH tokens back to respondent's wallet.
     *
     * Claim must be in `AwaitingResolution` state before executing this transaction and can only be executed by respondent.
     */
    ClaimManager.prototype.resolveTx = function (claimId, resolutionNote) {
        validation_1.validateNotEmpty(claimId, 'claimId');
        validation_1.validateNotEmpty(resolutionNote, 'resolutionNote');
        var tx = this.claimHandler.methods.resolve(claimId, resolutionNote);
        return tx;
    };
    /**
     * Creates transaction for closing a dispute.
     * This transaction closes the dispute and no further action can be performed with it. It also transfers requester's staked
     * MTH tokens back to requester's wallet and in case of expired resolution period - transfers respondent's staked MTH tokens to requester as well.
     *
     * This transaction and can only be executed by requester and dispute must be in one of these states:
     * - `AwaitingAcceptance` and acceptance period must be expired
     * - `AwaitingResolution` and resolution period must be expired
     * - `AwaitingConfirmation`
     */
    ClaimManager.prototype.closeTx = function (claimId) {
        validation_1.validateNotEmpty(claimId, 'claimId');
        var tx = this.claimHandler.methods.close(claimId);
        return tx;
    };
    // #endregion
    // #region -------------- Dispute retrieval -------------------------------------------------------------------
    /**
     * Gets dispute by id
     */
    ClaimManager.prototype.getClaim = function (claimId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var bcClaim, claim;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validation_1.validateNotEmpty(claimId, 'claimId');
                        return [4 /*yield*/, this.claimHandler.methods.claims(claimId).call()];
                    case 1:
                        bcClaim = _a.sent();
                        claim = {
                            id: claimId,
                            stateId: Number(bcClaim.state),
                            modifiedAt: new Date(Number(bcClaim.modified) * 1000).toISOString(),
                            dealId: Number(bcClaim.dealId),
                            reasonNote: bcClaim.reasonNote,
                            requesterId: bcClaim.requesterId,
                            requesterAddress: bcClaim.requesterAddress,
                            requesterStaked: conversion_1.blockchainTokensToFloat(new bignumber_js_1.default(bcClaim.requesterStaked)),
                            respondentId: bcClaim.respondentId,
                            respondentAddress: bcClaim.respondentAddress,
                            resolutionNote: bcClaim.resolutionNote,
                            contractAddress: this.claimHandler.address,
                        };
                        return [2 /*return*/, claim];
                }
            });
        });
    };
    // #endregion
    // #region -------------- Token allowance -------------------------------------------------------------------
    /**
     * Creates transaction to allow transfering specified amount of MTH tokens from user's wallet to claims contract.
     *
     * NOTE: if there is already any existing allowance - it must be cleared first or else the transaction will fail.
     * You can check existing allowance using `getAllowance` and clear it with `clearAllowanceTx`.
     */
    ClaimManager.prototype.allowTx = function (tokens) {
        validation_1.validateNotEmpty(tokens, 'tokens');
        var bcTokens = conversion_1.floatTokensToBlockchain(new bignumber_js_1.default(tokens)).toString();
        var tx = this.monethaToken.methods.approve(this.claimHandler.address, bcTokens);
        return tx;
    };
    /**
     * Creates transaction which clears existing amount of MTH tokens which are allowed to be transfered from user's wallet to claims contract
     */
    ClaimManager.prototype.clearAllowanceTx = function () {
        return this.allowTx(new bignumber_js_1.default(0));
    };
    /**
     * Gets allowed amount of MTH tokens to be transferred from user's wallet to claims contract
     */
    ClaimManager.prototype.getAllowance = function (walletAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var allowance;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validation_1.validateNotEmpty(walletAddress, 'walletAddress');
                        return [4 /*yield*/, this.monethaToken.methods.allowance(walletAddress, this.claimHandler.address).call()];
                    case 1:
                        allowance = _a.sent();
                        return [2 /*return*/, conversion_1.blockchainTokensToFloat(new bignumber_js_1.default(allowance))];
                }
            });
        });
    };
    return ClaimManager;
}());
exports.ClaimManager = ClaimManager;
