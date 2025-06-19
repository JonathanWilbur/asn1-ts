import { BIT_STRING, TRUE_BIT } from "../macros.mjs";

/**
 * @summary Unpacks a `Uint8Array` into a `BIT_STRING`
 * @description
 * Note: The result may be longer than the original bit string due to byte alignment.
 * @param {Uint8Array} bytes - The bytes to unpack.
 * @returns {BIT_STRING} The unpacked bit string.
 * @function
 */
export default
function unpackBits (bytes: Uint8Array): BIT_STRING {
    const ret: Uint8ClampedArray = new Uint8ClampedArray(bytes.length << 3);
    for (let byte: number = 0; byte < bytes.length; byte++) {
        for (let bit: number = 0; bit < 8; bit++) {
            if (bytes[byte] & (0x01 << (7 - bit))) {
                ret[(byte << 3) + bit] = TRUE_BIT;
            }
        }
    }
    return ret;
}
