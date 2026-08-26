/**
 * @summary Validates if a string is a `NumericString`
 * @param s - The string to validate.
 * @returns True if the string is a `NumericString`, false otherwise.
 * @function
 */
export function isNumericString(s: string): boolean {
    return /^[0-9 ]*$/.test(s);
}

export default isNumericString;
