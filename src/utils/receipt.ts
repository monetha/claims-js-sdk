import { validateNotEmpty } from './validation';
import { ITransactionReceipt } from 'src/models/tx';
import BigNumber from 'bignumber.js';

/**
 * Extracts claim ID from successful claim creation transaction receipt
 */
export function getClaimIdFromCreateTXReceipt(receipt: ITransactionReceipt) {
  validateNotEmpty(receipt, 'receipt');

  let claimIdHex = null;

  if (receipt.logs && receipt.logs[1]) {

    const { topics } = receipt.logs[1];
    if (topics && topics[2]) {
      claimIdHex = topics[2];
    }
  }

  if (!claimIdHex) {
    throw new Error('Receipt is not a valid claim creation receipt');
  }

  return new BigNumber(claimIdHex, 16).toNumber();
}
