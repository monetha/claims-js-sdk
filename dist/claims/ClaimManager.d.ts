import BigNumber from 'bignumber.js';
import { MonethaClaimHandler } from '../contracts/MonethaClaimHandler';
import { MonethaToken } from '../contracts/MonethaToken';
import { IClaim } from '../models/claim';
import Web3 from "web3";
export interface IOptions {
    web3: Web3;
    claimsHandlerContractAddress: string;
    monethaTokenContractAddress: string;
}
export interface ICreateClaimPayload {
    /**
     * Id of deal which dispute is being opened for
     **/
    dealId: number;
    /**
     * Description of the reason for the dispute
     **/
    reason: string;
    /**
     * Dispute requester's id
     */
    requesterId: string;
    /**
     * Dispute respondent's id
     */
    respondentId: string;
    /**
     * Amount of MTH tokens to stake
     */
    tokens: BigNumber;
}
/**
 * Allows managing disputes on Ethereum blockchain
 */
export declare class ClaimManager {
    monethaToken: MonethaToken;
    claimHandler: MonethaClaimHandler;
    web3: Web3;
    constructor(options: IOptions);
    /**
     * Creates transaction for opening a dispute.
     * This transaction stores information about problem to blockchain and and transfers staked amount of MTH tokens from user's (requester's)
     * wallet to claims handler contract.
     *
     * IMPORTANT: Transaction will only succeed if Monetha token contract has enough allowance to transfer staked MTH tokens from user's
     * wallet to claims handler contract. You can check existing allowance by calling `getAllowance` method and approve allowance by `allowTx`
     */
    createTx(payload: ICreateClaimPayload): import("../contracts/types.js").TransactionObject<void>;
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
    acceptTx(claimId: number): import("../contracts/types.js").TransactionObject<void>;
    /**
     * Creates transaction for resolving a dispute.
     * This transaction stores resolution note to blockchain and transfers respondent's staked MTH tokens back to respondent's wallet.
     *
     * Claim must be in `AwaitingResolution` state before executing this transaction and can only be executed by respondent.
     */
    resolveTx(claimId: number, resolutionNote: string): import("../contracts/types.js").TransactionObject<void>;
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
    closeTx(claimId: number): import("../contracts/types.js").TransactionObject<void>;
    /**
     * Gets dispute by id
     */
    getClaim(claimId: number): Promise<IClaim>;
    /**
     * Creates transaction to allow transfering specified amount of MTH tokens from user's wallet to claims contract.
     *
     * NOTE: if there is already any existing allowance - it must be cleared first or else the transaction will fail.
     * You can check existing allowance using `getAllowance` and clear it with `clearAllowanceTx`.
     */
    allowTx(tokens: BigNumber): import("../contracts/types.js").TransactionObject<boolean>;
    /**
     * Creates transaction which clears existing amount of MTH tokens which are allowed to be transfered from user's wallet to claims contract
     */
    clearAllowanceTx(): import("../contracts/types.js").TransactionObject<boolean>;
    /**
     * Gets allowed amount of MTH tokens to be transferred from user's wallet to claims contract
     */
    getAllowance(walletAddress: string): Promise<BigNumber>;
}
