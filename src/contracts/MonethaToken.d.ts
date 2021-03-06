/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractOptions, Options } from "web3-eth-contract";
import { Block } from "web3-eth";
import { EventLog } from "web3-core";
import { EventEmitter } from "events";
import { Callback, TransactionObject } from "./types";

export class MonethaToken extends Contract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  );
  methods: {
    balanceOf(arg0: string): TransactionObject<string>;

    allowance(arg0: string, arg1: string): TransactionObject<string>;

    approve(
      _spender: string,
      _value: number | string
    ): TransactionObject<boolean>;

    transferFrom(
      _from: string,
      _to: string,
      _value: number | string
    ): TransactionObject<boolean>;

    burn(): TransactionObject<void>;

    transfer(_to: string, _value: number | string): TransactionObject<boolean>;

    setICO(_icoAddress: string): TransactionObject<void>;

    setStart(_newStart: number | string): TransactionObject<void>;

    name(): TransactionObject<string>;
    totalSupply(): TransactionObject<string>;
    decimals(): TransactionObject<string>;
    standard(): TransactionObject<string>;
    ico(): TransactionObject<string>;
    lockedAmount(): TransactionObject<string>;
    startTime(): TransactionObject<string>;
    tokensForIco(): TransactionObject<string>;
    owner(): TransactionObject<string>;
    symbol(): TransactionObject<string>;
    lockReleaseDate(): TransactionObject<string>;
    reservedAmount(): TransactionObject<string>;
  };
  events: {
    Transfer(
      options?: {
        filter?: object;
        fromBlock?: number | string;
        topics?: (null | string)[];
      },
      cb?: Callback<EventLog>
    ): EventEmitter;

    Approval(
      options?: {
        filter?: object;
        fromBlock?: number | string;
        topics?: (null | string)[];
      },
      cb?: Callback<EventLog>
    ): EventEmitter;

    Burned(
      options?: {
        filter?: object;
        fromBlock?: number | string;
        topics?: (null | string)[];
      },
      cb?: Callback<EventLog>
    ): EventEmitter;

    allEvents: (
      options?: {
        filter?: object;
        fromBlock?: number | string;
        topics?: (null | string)[];
      },
      cb?: Callback<EventLog>
    ) => EventEmitter;
  };
}
