import { ITransactionReceipt } from '../models/tx';
/**
 * Extracts claim ID from successful claim creation transaction receipt
 */
export declare function getClaimIdFromCreateTXReceipt(receipt: ITransactionReceipt): number;
