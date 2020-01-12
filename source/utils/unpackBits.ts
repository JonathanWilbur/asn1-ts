import { TRUE_BIT } from "../macros";

/**
 * Note that this will not be exactly the reverse of `packBits()`, because this
 * is unaware of trailing bits, and so will always return an `Int8Array` that
 * is a multiple of eight in length.
 *
 * @param bytes
 */
export default
function unpackBits (bytes: Uint8Array): Int8Array {
    const ret: Int8Array = new Int8Array(bytes.length << 3);
    for (let byte: number = 0; byte < bytes.length; byte++) {
        for (let bit: number = 0; bit < 8; bit++) {
            if (bytes[byte] & (0x01 << (7 - bit))) {
                ret[(byte << 3) + bit] = TRUE_BIT;
            }
        }
    }
    return ret;
}
