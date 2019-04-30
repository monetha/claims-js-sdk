import BigNumber from 'bignumber.js';
/**
 * Converts raw token value from blockchain to floating comma value
 * @param blockchainTokens - raw tokens from blockchain
 */
export declare const blockchainTokensToFloat: (blockchainTokens: BigNumber) => BigNumber;
/**
 * Converts floating comma token value to raw value for blockchain
 * @param floatTokens - floating comma token value
 */
export declare const floatTokensToBlockchain: (floatTokens: BigNumber) => BigNumber;
