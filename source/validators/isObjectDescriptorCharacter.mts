import isGraphicCharacter from "./isGraphicCharacter.mjs";

/**
 * @summary Checks if a character code is a valid ASN.1 `ObjectDescriptor` character
 * @param {number} characterCode - The character code to check.
 * @returns {boolean} True if the character is valid for `ObjectDescriptor`, false otherwise.
 * @function
 */
export default
function isObjectDescriptorCharacter (characterCode: number): boolean {
    return isGraphicCharacter(characterCode);
}
