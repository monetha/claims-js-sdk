
/**
 * Checks if given value is not empty. Otherwise throws an error
 */
export function validateNotEmpty(value: any, paramName: string) {
  if (!value && value !== 0) {
    throw new Error(`"${paramName}" cannot be empty`);
  }
}

/**
 * Checks if given value does not exceed max length. Otherwise throws an error
 */
export function validateMaxLength(value: string | any[], maxLength: number, paramName: string) {
  if (!value) {
    return;
  }

  if (value.length > maxLength) {
    throw new Error(`"${paramName}" must not be longer than ${maxLength}`);
  }
}