/**
 * @summary Checks if a character code is a valid ASN.1 `NumericString` character (digits and space).
 * @param {number} characterCode - The character code to check.
 * @returns {boolean} True if the character is valid for `NumericString`, false otherwise.
 * @function
 */
export default
function isNumericString (characterCode: number): boolean {
    return ((characterCode >= 0x30 && characterCode <= 0x39) || characterCode === 0x20);
}
