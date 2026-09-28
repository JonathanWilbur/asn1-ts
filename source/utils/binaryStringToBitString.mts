import type { BIT_STRING } from "../macros.mjs";
import * as errors from "../errors.mjs";

/**
 * @summary Convert a binary string to a `BIT STRING` value
 * @description
 *
 * Converts a string of `"0"` and `"1"` characters, e.g. `"101"`, to a decoded
 * `BIT STRING` (`Uint8ClampedArray`, one entry per bit). An empty string
 * yields an empty `BIT STRING`.
 *
 * This is the inverse of {@link bitStringToBinaryString}.
 *
 * Benchmarked against a two-branch (`=== 49` / `=== 48`) loop: the
 * branchless `charCodeAt(i) - 48` form used here was fastest (roughly 2--3x
 * faster at 16k+ characters). The unsigned comparison also rejects
 * characters with codes below `"0"`, which a signed `> 1` check would miss.
 *
 * @param {string} str The binary string to convert, containing only `"0"` and `"1"`
 * @returns {BIT_STRING} One `0` / `1` entry per character
 * @throws {ASN1Error} If `str` contains any character other than `"0"` or `"1"`
 * @function
 */
export default
function binaryStringToBitString (str: string): BIT_STRING {
    const len: number = str.length;
    const ret: Uint8ClampedArray = new Uint8ClampedArray(len);
    for (let i: number = 0; i < len; i++) {
        const bit: number = str.charCodeAt(i) - 48; // "0" -> 0, "1" -> 1
        if ((bit >>> 0) > 1) {
            throw new errors.ASN1Error(
                `Invalid character '${str[i]}' in binary string; expected only '0' and '1'.`,
            );
        }
        ret[i] = bit;
    }
    return ret;
}
