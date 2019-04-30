import { BigNumber } from "bignumber.js";
export interface ITxParams {
    from?: string;
    gas?: number | string | BigNumber;
    gasPrice?: number | string | BigNumber;
}
export interface IPayableTxParams extends ITxParams {
    value: string | number | BigNumber;
}
export interface IWatchFilter {
    fromBlock?: string | number;
    toBlock?: string | number;
}
export declare class TypeChainContract {
    readonly contractAbi: object;
    readonly rawWeb3Contract: any;
    readonly address: string;
    constructor(web3: any, address: string | BigNumber, contractAbi: object);
}
export declare class DeferredTransactionWrapper<T extends ITxParams> {
    private readonly parentContract;
    private readonly methodName;
    private readonly methodArgs;
    constructor(parentContract: TypeChainContract, methodName: string, methodArgs: any[]);
    estimateGas(params: T, customWeb3?: any): Promise<number>;
    send(params: T, customWeb3?: any): Promise<string>;
    getData(): string;
}
export declare class DeferredEventWrapper<Event, EventIndexedFields> {
    private readonly parentContract;
    private readonly eventName;
    private readonly eventArgs?;
    constructor(parentContract: TypeChainContract, eventName: string, eventArgs?: EventIndexedFields);
    /**
     * Watches for a single log entry to be returned and then stops listening
     * @param watchFilter Optional filter for specifies blockNumber ranges to get data for
     * @returns First log entry which was seen
     */
    watchFirst(watchFilter: IWatchFilter): Promise<DecodedLogEntry<Event>>;
    /**
     * Watches for logs occurring and calls the callback when they happen
     * @param watchFilter Optional filter for specifies blockNumber ranges to get data for
     * @param callback Callback function which will be called each time an event happens
     * @returns function which can be called to stop watching this log
     */
    watch(watchFilter: IWatchFilter, callback: (err: any, event: DecodedLogEntry<Event>) => void): () => Promise<void>;
    /**
     * Gets the historical logs for this event
     * @param watchFilter Optional filter for specifies blockNumber ranges to get data for
     * @returns Array of event logs
     */
    get(watchFilter: IWatchFilter): Promise<DecodedLogEntry<Event>[]>;
    private getRawEvent;
}
export declare function promisify(func: any, args: any): Promise<any>;
export interface LogEntry {
    logIndex: number | null;
    transactionIndex: number | null;
    transactionHash: string;
    blockHash: string | null;
    blockNumber: number | null;
    address: string;
    data: string;
    topics: string[];
}
export interface DecodedLogEntry<A> extends LogEntry {
    event: string;
    args: A;
}
