/**
 * @summary Checks if a character code is a valid ASN.1 `PrintableString` character
 * @param {number} characterCode - The character code to check.
 * @returns {boolean} True if the character is valid for `PrintableString`, false otherwise.
 * @function
 */
export default
function isPrintableCharacter (characterCode: number): boolean {
    return (
        (characterCode >= 0x27 && characterCode <= 0x39 && characterCode !== 0x2A) // '()+,-./ AND 0 - 9 BUT NOT *
        || (characterCode >= 0x41 && characterCode <= 0x5A) // A - Z
        || (characterCode >= 0x61 && characterCode <= 0x7A) // a - z
        || (characterCode === 0x20) // SPACE
        || (characterCode === 0x3A) // :
        || (characterCode === 0x3D) // =
        || (characterCode === 0x3F) // ?
    );
}
