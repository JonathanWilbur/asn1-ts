
/**
 * @summary Checks if a string can be encoded as a BMP string.
 * @description
 *
 * This function checks if a string can be encoded as a BMP string.
 *
 * @param value The string to check.
 * @returns True if the string can be encoded as a BMP string, false otherwise.
 */
export function canEncodeAsBMPString(value: string): boolean {
    for (const character of value) {
        const codePoint = character.codePointAt(0)!;
        if (
            codePoint > 0xffff ||
            (codePoint >= 0xd800 && codePoint <= 0xdfff)
        ) {
            return false;
        }
    }
    return true;
}

export default canEncodeAsBMPString;
