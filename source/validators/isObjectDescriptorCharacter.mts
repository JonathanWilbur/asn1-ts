import isGraphicCharacter from "./isGraphicCharacter.mjs";

const isObjectDescriptorCharacter = isGraphicCharacter;

/**
 * @summary Checks if a character code is a valid ASN.1 `ObjectDescriptor` character
 * @param {number} characterCode - The character code to check.
 * @returns {boolean} True if the character is valid for `ObjectDescriptor`, false otherwise.
 * @function
 */
export default isObjectDescriptorCharacter;
