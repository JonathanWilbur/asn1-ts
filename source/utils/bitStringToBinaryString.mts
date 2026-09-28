import type { BIT_STRING } from "../macros.mjs";

/**
 * Precomputed binary text for every possible byte value.
 * Indexing this table is faster than branching per bit or concatenating
 * one character at a time, and joining `ceil(n / 8)` chunks is faster than
 * joining `n` single characters.
 */
const BYTE_TO_BINARY_STRING: readonly string[] = (() => {
    const table: string[] = new Array<string>(256);
    for (let b = 0; b < 256; b++) {
        table[b] = b.toString(2).padStart(8, "0");
    }
    return table;
})();

/**
 * @summary Convert a `BIT STRING` value to a binary string
 * @description
 *
 * Converts a decoded `BIT STRING` (`Uint8ClampedArray`, one entry per bit)
 * to a string of `"0"` and `"1"` characters, e.g. `new Uint8ClampedArray([1, 0, 1])`
 * becomes `"101"`. Each entry must be `0` or `1`, as produced by this
 * library's decoders.
 *
 * This is the inverse of {@link binaryStringToBitString}.
 *
 * Benchmarked against per-bit string concatenation (`+=`), per-bit array
 * `join`, and chunked `String.fromCharCode`: the 256-entry lookup table used
 * here was fastest across sizes (roughly 4--6x faster than `+=` at 16k+ bits,
 * and at parity for tiny inputs).
 *
 * @param {BIT_STRING} bits The `BIT STRING` value to convert
 * @returns {string} One `"0"` / `"1"` character per bit
 * @function
 */
export default
function bitStringToBinaryString (bits: BIT_STRING): string {
    const len: number = bits.length;
    if (len === 0) {
        return "";
    }
    const fullBytes: number = len >> 3;
    const remainder: number = len & 7;
    const parts: string[] = new Array<string>(fullBytes + (remainder ? 1 : 0));
    let j: number = 0;
    for (let i: number = 0; i < fullBytes; i++, j += 8) {
        parts[i] = BYTE_TO_BINARY_STRING[
            (bits[j] << 7)
            | (bits[j + 1] << 6)
            | (bits[j + 2] << 5)
            | (bits[j + 3] << 4)
            | (bits[j + 4] << 3)
            | (bits[j + 5] << 2)
            | (bits[j + 6] << 1)
            | bits[j + 7]
        ]!;
    }
    if (remainder) {
        let last: number = 0;
        for (let k: number = 0; k < remainder; k++) {
            last |= bits[j + k]! << (7 - k);
        }
        // The table entry always holds 8 chars; only the first `remainder` are significant.
        parts[fullBytes] = BYTE_TO_BINARY_STRING[last]!.slice(0, remainder);
    }
    return parts.join("");
}
