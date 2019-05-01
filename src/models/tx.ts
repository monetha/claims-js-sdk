import { ITxParams } from 'src/contracts/typechain-runtime';

export interface IDeferredTransactionWrapper<T extends ITxParams> {
  estimateGas(params: T, customWeb3?: any): Promise<number>;
  getData(): string;
  contractAddress?: string;
}

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