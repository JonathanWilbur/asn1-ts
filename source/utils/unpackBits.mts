import { BIT_STRING, TRUE_BIT } from "../macros.mjs";

/**
 * Note that this will not be exactly the reverse of `packBits()`, because this
 * is unaware of trailing bits, and so will always return an `Uint8ClampedArray` that
 * is a multiple of eight in length.
 *
 * @param bytes
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
