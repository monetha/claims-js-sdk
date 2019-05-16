import BigNumber from 'bignumber.js';
import { MonethaClaimHandler } from 'src/contracts/MonethaClaimHandler';
import { MonethaToken } from 'src/contracts/MonethaToken';
import { IClaim } from 'src/models/claim';
import { blockchainTokensToFloat, floatTokensToBlockchain } from 'src/utils/conversion';
import { validateNotEmpty } from 'src/utils/validation';
import * as claimsHandlerContractAbi from '../contracts/MonethaClaimHandler.json';
import * as monethaTokenContractAbi from '../contracts/MonethaToken.json';
import Web3 from "web3";
import {AbiItem} from 'web3-utils';

// #region -------------- Interfaces -------------------------------------------------------------------

export interface IOptions {
  web3: Web3,
  claimsHandlerContractAddress: string,
  monethaTokenContractAddress: string,
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

// #endregion

/**
 * Allows managing disputes on Ethereum blockchain
 */
export class ClaimManager {
  public monethaToken: MonethaToken;
  public claimHandler: MonethaClaimHandler;

  public constructor(options: IOptions) {
    validateNotEmpty(options, 'options');

    const { web3, claimsHandlerContractAddress, monethaTokenContractAddress } = options;
    validateNotEmpty(web3, 'options.web3');
    validateNotEmpty(claimsHandlerContractAddress, 'options.claimsHandlerContractAddress');
    validateNotEmpty(monethaTokenContractAddress, 'options.monethaTokenContractAddress');

    this.claimHandler = new web3.eth.Contract(claimsHandlerContractAbi as AbiItem[], claimsHandlerContractAddress) as MonethaClaimHandler;
    this.monethaToken = new web3.eth.Contract(monethaTokenContractAbi as AbiItem[], monethaTokenContractAddress) as MonethaToken;
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
  public createTx(payload: ICreateClaimPayload) {
    validateNotEmpty(payload, 'payload');

    const { dealId, reason, requesterId, respondentId, tokens } = payload;
    validateNotEmpty(dealId, 'payload.dealId');
    validateNotEmpty(reason, 'payload.reason');
    validateNotEmpty(requesterId, 'payload.requesterId');
    validateNotEmpty(respondentId, 'payload.respondentId');
    validateNotEmpty(tokens, 'payload.tokens');

    const bcTokens = floatTokensToBlockchain(new BigNumber(tokens)).toString();

    const tx = this.claimHandler.methods.create(dealId, '0x1', reason, requesterId, respondentId, bcTokens);

    return tx;
  }

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
  public acceptTx(claimId: number) {
    validateNotEmpty(claimId, 'claimId');

    const tx = this.claimHandler.methods.accept(claimId);

    return tx;
  }

  /**
   * Creates transaction for resolving a dispute.
   * This transaction stores resolution note to blockchain and transfers respondent's staked MTH tokens back to respondent's wallet.
   *
   * Claim must be in `AwaitingResolution` state before executing this transaction and can only be executed by respondent.
   */
  public resolveTx(claimId: number, resolutionNote: string) {
    validateNotEmpty(claimId, 'claimId');
    validateNotEmpty(resolutionNote, 'resolutionNote');

    const tx = this.claimHandler.methods.resolve(claimId, resolutionNote);

    return tx;
  }

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
  public closeTx(claimId: number) {
    validateNotEmpty(claimId, 'claimId');

    const tx = this.claimHandler.methods.close(claimId);

    return tx;
  }

  // #endregion

  // #region -------------- Dispute retrieval -------------------------------------------------------------------

  /**
   * Gets dispute by id
   */
  public async getClaim(claimId: number) {
    validateNotEmpty(claimId, 'claimId');

    const bcClaim = await this.claimHandler.methods.claims(claimId).call();

    const claim: IClaim = {
      id: claimId,
      stateId: Number(bcClaim.state),
      modifiedAt: new Date(Number(bcClaim.modified) * 1000).toISOString(),
      dealId: Number(bcClaim.dealId),
      reasonNote: bcClaim.reasonNote,
      requesterId: bcClaim.requesterId,
      requesterAddress: bcClaim.requesterAddress,
      requesterStaked: blockchainTokensToFloat(new BigNumber(bcClaim.requesterStaked)),
      respondentId: bcClaim.respondentId,
      respondentAddress: bcClaim.respondentAddress,
      resolutionNote: bcClaim.resolutionNote,
      contractAddress: this.claimHandler.address,
    };

    return claim;
  }

  // #endregion

  // #region -------------- Token allowance -------------------------------------------------------------------

  /**
   * Creates transaction to allow transfering specified amount of MTH tokens from user's wallet to claims contract.
   *
   * NOTE: if there is already any existing allowance - it must be cleared first or else the transaction will fail.
   * You can check existing allowance using `getAllowance` and clear it with `clearAllowanceTx`.
   */
  public allowTx(tokens: BigNumber) {
    validateNotEmpty(tokens, 'tokens');

    const bcTokens = floatTokensToBlockchain(new BigNumber(tokens)).toString();

    const tx = this.monethaToken.methods.approve(this.claimHandler.address, bcTokens);

    return tx;
  }

  /**
   * Creates transaction which clears existing amount of MTH tokens which are allowed to be transfered from user's wallet to claims contract
   */
  public clearAllowanceTx() {
    return this.allowTx(new BigNumber(0));
  }

  /**
   * Gets allowed amount of MTH tokens to be transferred from user's wallet to claims contract
   */
  public async getAllowance(walletAddress: string) {
    validateNotEmpty(walletAddress, 'walletAddress');

    const allowance = await this.monethaToken.methods.allowance(walletAddress, this.claimHandler.address).call();

    return blockchainTokensToFloat(new BigNumber(allowance));
  }

  // #endregion
}