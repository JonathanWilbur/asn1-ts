/**
 * @summary Checks if a character code is a valid ASN.1 `tstring` character.
 * @param {number} characterCode - The character code to check.
 * @returns {boolean} True if the character is valid for `TimeString`, false otherwise.
 * @function
 */
export
function isTimeCharacter (characterCode: number): boolean {
    return (
        (characterCode >= 0x30 && characterCode <= 0x39)
        || (characterCode === '.'.charCodeAt(0))
        || (characterCode === ','.charCodeAt(0))
        || (characterCode === ':'.charCodeAt(0))
        || (characterCode === '/'.charCodeAt(0))
        || (characterCode === 'C'.charCodeAt(0))
        || (characterCode === 'D'.charCodeAt(0))
        || (characterCode === 'H'.charCodeAt(0))
        || (characterCode === 'M'.charCodeAt(0))
        || (characterCode === 'R'.charCodeAt(0))
        || (characterCode === 'P'.charCodeAt(0))
        || (characterCode === 'S'.charCodeAt(0))
        || (characterCode === 'T'.charCodeAt(0))
        || (characterCode === 'W'.charCodeAt(0))
        || (characterCode === 'Y'.charCodeAt(0))
        || (characterCode === 'Z'.charCodeAt(0))
    );
}

export default isTimeCharacter;
