"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bignumber_js_1 = require("bignumber.js");
var MonethaClaimHandler_1 = require("../contracts/MonethaClaimHandler");
var MonethaToken_1 = require("../contracts/MonethaToken");
var conversion_1 = require("../utils/conversion");
var validation_1 = require("../utils/validation");
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
        this.claimHandler = new MonethaClaimHandler_1.MonethaClaimHandler(web3, claimsHandlerContractAddress);
        this.monethaToken = new MonethaToken_1.MonethaToken(web3, monethaTokenContractAddress);
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
        var bcTokens = conversion_1.floatTokensToBlockchain(new bignumber_js_1.default(tokens));
        return this.claimHandler.createTx(dealId, '0x1', reason, requesterId, respondentId, bcTokens);
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
        return this.claimHandler.acceptTx(claimId);
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
        return this.claimHandler.resolveTx(claimId, resolutionNote);
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
        return this.claimHandler.closeTx(claimId);
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
                        return [4 /*yield*/, this.claimHandler.claims(claimId)];
                    case 1:
                        bcClaim = _a.sent();
                        claim = {
                            id: claimId,
                            stateId: bcClaim[0].toNumber(),
                            modifiedAt: new Date(bcClaim[1].toNumber() * 1000).toISOString(),
                            dealId: bcClaim[2].toNumber(),
                            reasonNote: bcClaim[4],
                            requesterId: bcClaim[5],
                            requesterAddress: bcClaim[6],
                            requesterStaked: conversion_1.blockchainTokensToFloat(bcClaim[7]),
                            respondentId: bcClaim[8],
                            respondentAddress: bcClaim[9],
                            resolutionNote: bcClaim[11],
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
        var bcTokens = conversion_1.floatTokensToBlockchain(new bignumber_js_1.default(tokens));
        return this.monethaToken.approveTx(this.claimHandler.address, bcTokens);
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
                        return [4 /*yield*/, this.monethaToken.allowance(walletAddress, this.claimHandler.address)];
                    case 1:
                        allowance = _a.sent();
                        return [2 /*return*/, conversion_1.blockchainTokensToFloat(allowance)];
                }
            });
        });
    };
    return ClaimManager;
}());
exports.ClaimManager = ClaimManager;
