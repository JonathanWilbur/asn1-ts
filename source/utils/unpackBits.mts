import type { BIT_STRING } from "../macros.mjs";

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
    const len: number = bytes.length;
    const ret: Uint8ClampedArray = new Uint8ClampedArray(len << 3);
    let j: number = 0;
    for (let i: number = 0; i < len; i++, j += 8) {
        const b: number = bytes[i];
        ret[j]     = b >> 7;
        ret[j + 1] = (b >> 6) & 1;
        ret[j + 2] = (b >> 5) & 1;
        ret[j + 3] = (b >> 4) & 1;
        ret[j + 4] = (b >> 3) & 1;
        ret[j + 5] = (b >> 2) & 1;
        ret[j + 6] = (b >> 1) & 1;
        ret[j + 7] = b & 1;
    }
    return ret;
}
