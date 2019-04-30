import BigNumber from 'bignumber.js';
import { MTHDecimals } from 'src/constants';

// #region -------------- Token conversions -------------------------------------------------------------------

/**
 * Converts raw token value from blockchain to floating comma value
 * @param blockchainTokens - raw tokens from blockchain
 */
export const blockchainTokensToFloat = (blockchainTokens: BigNumber) => {
  const divider = (new BigNumber(10)).exponentiatedBy(MTHDecimals);
  return blockchainTokens.div(divider);
}

/**
 * Converts floating comma token value to raw value for blockchain
 * @param floatTokens - floating comma token value
 */
export const floatTokensToBlockchain = (floatTokens: BigNumber) => {
  const multiplier = (new BigNumber(10)).exponentiatedBy(MTHDecimals);
  return floatTokens.multipliedBy(multiplier);
}

// #endregion