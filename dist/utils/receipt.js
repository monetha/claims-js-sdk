"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validation_1 = require("./validation");
var bignumber_js_1 = require("bignumber.js");
/**
 * Extracts claim ID from successful claim creation transaction receipt
 */
function getClaimIdFromCreateTXReceipt(receipt) {
    validation_1.validateNotEmpty(receipt, 'receipt');
    var claimIdHex = null;
    if (receipt.logs && receipt.logs[1]) {
        var topics = receipt.logs[1].topics;
        if (topics && topics[2]) {
            claimIdHex = topics[2];
        }
    }
    if (!claimIdHex) {
        throw new Error('Receipt is not a valid claim creation receipt');
    }
    return new bignumber_js_1.default(claimIdHex, 16).toNumber();
}
exports.getClaimIdFromCreateTXReceipt = getClaimIdFromCreateTXReceipt;
//# sourceMappingURL=receipt.js.map