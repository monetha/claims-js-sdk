import { TransactionObject } from '../contracts/types';
export interface ITransactionReceipt {
    blockHash?: string;
    blockNumber?: string;
    contractAddress?: string;
    cumulativeGasUsed?: string;
    from?: string;
    gasUsed?: string;
    logs?: any;
    logsBloom?: string;
    status?: string;
    to?: string;
    transactionHash?: string;
    transactionIndex?: string;
}
export interface ITransactionObject<T> extends TransactionObject<T> {
    contractAddress?: string;
}
