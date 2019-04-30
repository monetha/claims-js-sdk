"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Checks if given value is not empty. Otherwise throws an error
 */
function validateNotEmpty(value, paramName) {
    if (!value && value !== 0) {
        throw new Error("\"" + paramName + "\" cannot be empty");
    }
}
exports.validateNotEmpty = validateNotEmpty;
/**
 * Checks if given value does not exceed max length. Otherwise throws an error
 */
function validateMaxLength(value, maxLength, paramName) {
    if (!value) {
        return;
    }
    if (value.length > maxLength) {
        throw new Error("\"" + paramName + "\" must not be longer than " + maxLength);
    }
}
exports.validateMaxLength = validateMaxLength;
