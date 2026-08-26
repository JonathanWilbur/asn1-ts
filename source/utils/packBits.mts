import type { BIT_STRING, SingleThreadUint8Array } from "../macros.mjs";

/**
 * @summary Packs a `BIT STRING` into a `Uint8Array`
 * @description
 * Used for ASN.1 `BIT STRING` encoding.
 * Each element of `bits` is treated as a 0 or 1.
 * If `dest` is supplied, packed bytes are written into it starting at `offset`
 * and `dest` is returned. `dest` must have room for `offset + ceil(bits.length / 8)` bytes.
 * @param {BIT_STRING} bits - The bit string to pack.
 * @param {Uint8Array} [dest] - An existing buffer to pack into. Allocated if omitted.
 * @param {number} [offset=0] - The index in `dest` at which to start writing.
 * @returns {Uint8Array<ArrayBuffer>} The packed bytes.
 * @function
 */
export default
function packBits (
    bits: BIT_STRING,
    dest: SingleThreadUint8Array = new Uint8Array((bits.length + 7) >> 3),
    offset: number = 0,
): SingleThreadUint8Array {
    const len: number = bits.length;
    const fullBytes: number = len >> 3;
    const end: number = offset + fullBytes;
    let i: number = offset;
    let j: number = 0;
    for (; i < end; i++, j += 8) {
        dest[i] = (bits[j] << 7)
            | (bits[j + 1] << 6)
            | (bits[j + 2] << 5)
            | (bits[j + 3] << 4)
            | (bits[j + 4] << 3)
            | (bits[j + 5] << 2)
            | (bits[j + 6] << 1)
            | (bits[j + 7]);
    }
    if (j < len) {
        let byte: number = 0;
        for (let k: number = 0; j < len; j++, k++) {
            byte |= bits[j] << (7 - k);
        }
        dest[i] = byte;
    }
    return dest;
}
