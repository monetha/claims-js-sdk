"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = require("bignumber.js");
var constants_1 = require("../constants");
// #region -------------- Token conversions -------------------------------------------------------------------
/**
 * Converts raw token value from blockchain to floating comma value
 * @param blockchainTokens - raw tokens from blockchain
 */
exports.blockchainTokensToFloat = function (blockchainTokens) {
    var divider = (new bignumber_js_1.default(10)).exponentiatedBy(constants_1.MTHDecimals);
    return new bignumber_js_1.default(blockchainTokens).div(divider);
};
/**
 * Converts floating comma token value to raw value for blockchain
 * @param floatTokens - floating comma token value
 */
exports.floatTokensToBlockchain = function (floatTokens) {
    var multiplier = (new bignumber_js_1.default(10)).exponentiatedBy(constants_1.MTHDecimals);
    return new bignumber_js_1.default(floatTokens).multipliedBy(multiplier);
};
// #endregion
//# sourceMappingURL=conversion.js.map