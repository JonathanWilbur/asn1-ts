import isGraphicCharacter from "./isGraphicCharacter.mjs";

const isVisibleCharacter = isGraphicCharacter;

/**
 * @summary Checks if a character code is a valid ASN.1 `VisibleString` character
 * @param {number} characterCode - The character code to check.
 * @returns {boolean} True if the character is valid for `VisibleString`, false otherwise.
 * @function
 */
export default isVisibleCharacter;
