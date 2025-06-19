/**
 * @summary Checks if a character code is a valid ASN.1 `GeneralString` character
 * @description
 *
 * Note that this is not exactly correct. A `GeneralString` can contain any character from any
 * encoding, which is big part of why it is not recommended to use.
 *
 * This is a simple check for ASCII characters (0x00-0x7F). This is probably what you should
 * assume and use if you ever use `GeneralString`.
 *
 * @param {number} characterCode - The character code to check.
 * @returns {boolean} True if the character is valid for `GeneralString`, false otherwise.
 * @function
 */
export default
function isGeneralCharacter (characterCode: number): boolean {
    return (characterCode <= 0x7F);
}
