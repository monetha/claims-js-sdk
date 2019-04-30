import { BigNumber } from "bignumber.js";
import * as TC from "./typechain-runtime";
export declare class MonethaToken extends TC.TypeChainContract {
    readonly rawWeb3Contract: any;
    constructor(web3: any, address: string | BigNumber);
    static createAndValidate(web3: any, address: string | BigNumber): Promise<MonethaToken>;
    readonly name: Promise<string>;
    readonly totalSupply: Promise<BigNumber>;
    readonly decimals: Promise<BigNumber>;
    readonly standard: Promise<string>;
    readonly ico: Promise<string>;
    readonly lockedAmount: Promise<BigNumber>;
    readonly startTime: Promise<BigNumber>;
    readonly tokensForIco: Promise<BigNumber>;
    readonly owner: Promise<string>;
    readonly symbol: Promise<string>;
    readonly lockReleaseDate: Promise<BigNumber>;
    readonly reservedAmount: Promise<BigNumber>;
    balanceOf(arg0: BigNumber | string): Promise<BigNumber>;
    allowance(arg0: BigNumber | string, arg1: BigNumber | string): Promise<BigNumber>;
    approveTx(_spender: BigNumber | string, _value: BigNumber | number): TC.DeferredTransactionWrapper<TC.ITxParams>;
    transferFromTx(_from: BigNumber | string, _to: BigNumber | string, _value: BigNumber | number): TC.DeferredTransactionWrapper<TC.ITxParams>;
    burnTx(): TC.DeferredTransactionWrapper<TC.ITxParams>;
    transferTx(_to: BigNumber | string, _value: BigNumber | number): TC.DeferredTransactionWrapper<TC.ITxParams>;
    setICOTx(_icoAddress: BigNumber | string): TC.DeferredTransactionWrapper<TC.ITxParams>;
    setStartTx(_newStart: BigNumber | number): TC.DeferredTransactionWrapper<TC.ITxParams>;
    TransferEvent(eventFilter: {
        from?: BigNumber | string | Array<BigNumber | string>;
        to?: BigNumber | string | Array<BigNumber | string>;
    }): TC.DeferredEventWrapper<{
        from: BigNumber | string;
        to: BigNumber | string;
        value: BigNumber | number;
    }, {
        from?: BigNumber | string | Array<BigNumber | string>;
        to?: BigNumber | string | Array<BigNumber | string>;
    }>;
    ApprovalEvent(eventFilter: {
        _owner?: BigNumber | string | Array<BigNumber | string>;
        spender?: BigNumber | string | Array<BigNumber | string>;
    }): TC.DeferredEventWrapper<{
        _owner: BigNumber | string;
        spender: BigNumber | string;
        value: BigNumber | number;
    }, {
        _owner?: BigNumber | string | Array<BigNumber | string>;
        spender?: BigNumber | string | Array<BigNumber | string>;
    }>;
    BurnedEvent(eventFilter: {}): TC.DeferredEventWrapper<{
        amount: BigNumber | number;
    }, {}>;
}
