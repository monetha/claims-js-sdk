import BigNumber from 'bignumber.js';
import { MonethaClaimHandler } from 'src/contracts/MonethaClaimHandler';
import { MonethaToken } from 'src/contracts/MonethaToken';
import { IClaim } from 'src/models/claim';
import { blockchainTokensToFloat, floatTokensToBlockchain } from 'src/utils/conversion';
import { validateNotEmpty } from 'src/utils/validation';

// #region -------------- Interfaces -------------------------------------------------------------------

export interface IOptions {
  web3: any,
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

    this.claimHandler = new MonethaClaimHandler(web3, claimsHandlerContractAddress);
    this.monethaToken = new MonethaToken(web3, monethaTokenContractAddress);
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

    const bcTokens = floatTokensToBlockchain(new BigNumber(tokens));

    return this.claimHandler.createTx(dealId, '0x1', reason, requesterId, respondentId, bcTokens);
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

    return this.claimHandler.acceptTx(claimId);
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

    return this.claimHandler.resolveTx(claimId, resolutionNote);
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

    return this.claimHandler.closeTx(claimId);
  }

  // #endregion

  // #region -------------- Dispute retrieval -------------------------------------------------------------------

  /**
   * Gets dispute by id
   */
  public async getClaim(claimId: number) {
    validateNotEmpty(claimId, 'claimId');

    const bcClaim: [
      BigNumber,
      BigNumber,
      BigNumber,
      string,
      string,
      string,
      string,
      BigNumber,
      string,
      string,
      BigNumber,
      string
    ] = await this.claimHandler.claims(claimId);

    const claim: IClaim = {
      id: claimId,
      stateId: bcClaim[0].toNumber(),
      modifiedAt: new Date(bcClaim[1].toNumber() * 1000).toISOString(),
      dealId: bcClaim[2].toNumber(),
      reasonNote: bcClaim[4],
      requesterId: bcClaim[5],
      requesterAddress: bcClaim[6],
      requesterStaked: blockchainTokensToFloat(bcClaim[7]),
      respondentId: bcClaim[8],
      respondentAddress: bcClaim[9],
      resolutionNote: bcClaim[11],
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

    const bcTokens = floatTokensToBlockchain(new BigNumber(tokens));

    return this.monethaToken.approveTx(this.claimHandler.address, bcTokens);
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

    const allowance = await this.monethaToken.allowance(walletAddress, this.claimHandler.address);

    return blockchainTokensToFloat(allowance);
  }

  // #endregion
}