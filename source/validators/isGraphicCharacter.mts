/**
 * @summary Checks if a character code is a valid ASN.1 `GraphicString` character (ASCII 0x20-0x7E).
 * @param {number} characterCode - The character code to check.
 * @returns {boolean} True if the character is valid for `GraphicString`, false otherwise.
 * @function
 */
export default
function isGraphicCharacter (characterCode: number): boolean {
    return (characterCode >= 0x20 && characterCode <= 0x7E);
}
