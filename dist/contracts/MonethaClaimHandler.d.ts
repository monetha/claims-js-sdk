import { BigNumber } from "bignumber.js";
import * as TC from "./typechain-runtime";
export declare class MonethaClaimHandler extends TC.TypeChainContract {
    readonly rawWeb3Contract: any;
    constructor(web3: any, address: string | BigNumber);
    static createAndValidate(web3: any, address: string | BigNumber): Promise<MonethaClaimHandler>;
    readonly minStake: Promise<BigNumber>;
    readonly paused: Promise<boolean>;
    readonly owner: Promise<string>;
    readonly token: Promise<string>;
    readonly getClaimsCount: Promise<BigNumber>;
    isMonethaAddress(arg0: BigNumber | string): Promise<boolean>;
    claims(arg0: BigNumber | number): Promise<[BigNumber, BigNumber, BigNumber, string, string, string, string, BigNumber, string, string, BigNumber, string]>;
    reclaimTokenTx(_token: BigNumber | string): TC.DeferredTransactionWrapper<TC.ITxParams>;
    reclaimEtherToTx(_to: BigNumber | string, _value: BigNumber | number): TC.DeferredTransactionWrapper<TC.ITxParams>;
    unpauseTx(): TC.DeferredTransactionWrapper<TC.ITxParams>;
    renounceOwnershipTx(): TC.DeferredTransactionWrapper<TC.ITxParams>;
    pauseTx(): TC.DeferredTransactionWrapper<TC.ITxParams>;
    reclaimEtherTx(): TC.DeferredTransactionWrapper<TC.ITxParams>;
    reclaimTokenToTx(_token: BigNumber | string, _to: BigNumber | string, _value: BigNumber | number): TC.DeferredTransactionWrapper<TC.ITxParams>;
    setMonethaAddressTx(_address: BigNumber | string, _isMonethaAddress: boolean): TC.DeferredTransactionWrapper<TC.ITxParams>;
    transferOwnershipTx(_newOwner: BigNumber | string): TC.DeferredTransactionWrapper<TC.ITxParams>;
    setMinStakeTx(_newMinStake: BigNumber | number): TC.DeferredTransactionWrapper<TC.ITxParams>;
    createTx(_dealId: BigNumber | number, _dealHash: string, _reasonNote: string, _requesterId: string, _respondentId: string, _amountToStake: BigNumber | number): TC.DeferredTransactionWrapper<TC.ITxParams>;
    acceptTx(_claimIdx: BigNumber | number): TC.DeferredTransactionWrapper<TC.ITxParams>;
    resolveTx(_claimIdx: BigNumber | number, _resolutionNote: string): TC.DeferredTransactionWrapper<TC.ITxParams>;
    closeTx(_claimIdx: BigNumber | number): TC.DeferredTransactionWrapper<TC.ITxParams>;
    MinStakeUpdatedEvent(eventFilter: {}): TC.DeferredEventWrapper<{
        previousMinStake: BigNumber | number;
        newMinStake: BigNumber | number;
    }, {}>;
    ClaimCreatedEvent(eventFilter: {
        dealId?: BigNumber | number | Array<BigNumber | number>;
        claimIdx?: BigNumber | number | Array<BigNumber | number>;
    }): TC.DeferredEventWrapper<{
        dealId: BigNumber | number;
        claimIdx: BigNumber | number;
    }, {
        dealId?: BigNumber | number | Array<BigNumber | number>;
        claimIdx?: BigNumber | number | Array<BigNumber | number>;
    }>;
    ClaimAcceptedEvent(eventFilter: {
        dealId?: BigNumber | number | Array<BigNumber | number>;
        claimIdx?: BigNumber | number | Array<BigNumber | number>;
    }): TC.DeferredEventWrapper<{
        dealId: BigNumber | number;
        claimIdx: BigNumber | number;
    }, {
        dealId?: BigNumber | number | Array<BigNumber | number>;
        claimIdx?: BigNumber | number | Array<BigNumber | number>;
    }>;
    ClaimResolvedEvent(eventFilter: {
        dealId?: BigNumber | number | Array<BigNumber | number>;
        claimIdx?: BigNumber | number | Array<BigNumber | number>;
    }): TC.DeferredEventWrapper<{
        dealId: BigNumber | number;
        claimIdx: BigNumber | number;
    }, {
        dealId?: BigNumber | number | Array<BigNumber | number>;
        claimIdx?: BigNumber | number | Array<BigNumber | number>;
    }>;
    ClaimClosedAfterAcceptanceExpiredEvent(eventFilter: {
        dealId?: BigNumber | number | Array<BigNumber | number>;
        claimIdx?: BigNumber | number | Array<BigNumber | number>;
    }): TC.DeferredEventWrapper<{
        dealId: BigNumber | number;
        claimIdx: BigNumber | number;
    }, {
        dealId?: BigNumber | number | Array<BigNumber | number>;
        claimIdx?: BigNumber | number | Array<BigNumber | number>;
    }>;
    ClaimClosedAfterResolutionExpiredEvent(eventFilter: {
        dealId?: BigNumber | number | Array<BigNumber | number>;
        claimIdx?: BigNumber | number | Array<BigNumber | number>;
    }): TC.DeferredEventWrapper<{
        dealId: BigNumber | number;
        claimIdx: BigNumber | number;
    }, {
        dealId?: BigNumber | number | Array<BigNumber | number>;
        claimIdx?: BigNumber | number | Array<BigNumber | number>;
    }>;
    ClaimClosedAfterConfirmationExpiredEvent(eventFilter: {
        dealId?: BigNumber | number | Array<BigNumber | number>;
        claimIdx?: BigNumber | number | Array<BigNumber | number>;
    }): TC.DeferredEventWrapper<{
        dealId: BigNumber | number;
        claimIdx: BigNumber | number;
    }, {
        dealId?: BigNumber | number | Array<BigNumber | number>;
        claimIdx?: BigNumber | number | Array<BigNumber | number>;
    }>;
    ClaimClosedEvent(eventFilter: {
        dealId?: BigNumber | number | Array<BigNumber | number>;
        claimIdx?: BigNumber | number | Array<BigNumber | number>;
    }): TC.DeferredEventWrapper<{
        dealId: BigNumber | number;
        claimIdx: BigNumber | number;
    }, {
        dealId?: BigNumber | number | Array<BigNumber | number>;
        claimIdx?: BigNumber | number | Array<BigNumber | number>;
    }>;
    ReclaimTokensEvent(eventFilter: {
        to?: BigNumber | string | Array<BigNumber | string>;
    }): TC.DeferredEventWrapper<{
        to: BigNumber | string;
        amount: BigNumber | number;
    }, {
        to?: BigNumber | string | Array<BigNumber | string>;
    }>;
    ReclaimEtherEvent(eventFilter: {
        to?: BigNumber | string | Array<BigNumber | string>;
    }): TC.DeferredEventWrapper<{
        to: BigNumber | string;
        amount: BigNumber | number;
    }, {
        to?: BigNumber | string | Array<BigNumber | string>;
    }>;
    PauseEvent(eventFilter: {}): TC.DeferredEventWrapper<{}, {}>;
    UnpauseEvent(eventFilter: {}): TC.DeferredEventWrapper<{}, {}>;
    MonethaAddressSetEvent(eventFilter: {}): TC.DeferredEventWrapper<{
        _address: BigNumber | string;
        _isMonethaAddress: boolean;
    }, {}>;
    OwnershipRenouncedEvent(eventFilter: {
        previousOwner?: BigNumber | string | Array<BigNumber | string>;
    }): TC.DeferredEventWrapper<{
        previousOwner: BigNumber | string;
    }, {
        previousOwner?: BigNumber | string | Array<BigNumber | string>;
    }>;
    OwnershipTransferredEvent(eventFilter: {
        previousOwner?: BigNumber | string | Array<BigNumber | string>;
        newOwner?: BigNumber | string | Array<BigNumber | string>;
    }): TC.DeferredEventWrapper<{
        previousOwner: BigNumber | string;
        newOwner: BigNumber | string;
    }, {
        previousOwner?: BigNumber | string | Array<BigNumber | string>;
        newOwner?: BigNumber | string | Array<BigNumber | string>;
    }>;
}
