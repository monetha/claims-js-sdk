/**
 * Checks if given value is not empty. Otherwise throws an error
 */
export declare function validateNotEmpty(value: any, paramName: string): void;
/**
 * Checks if given value does not exceed max length. Otherwise throws an error
 */
export declare function validateMaxLength(value: string | any[], maxLength: number, paramName: string): void;
