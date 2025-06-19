import * as errors from "../errors.mjs";
import { Buffer } from "node:buffer";

/**
 * @summary Decodes a signed big-endian integer from a `Uint8Array`
 * @description
 * Throws if the value is too large for a 32-bit signed integer.
 * @param {Uint8Array} value - The bytes representing the signed integer in big-endian order.
 * @returns {number} The decoded signed integer.
 * @throws {ASN1OverflowError} If the input is too long to decode as a 32-bit signed integer.
 * @function
 */
export default
function decodeSignedBigEndianInteger (value: Uint8Array): number {
    if (value.length === 0) {
        return 0;
    }
    if (value.length > 4) {
        throw new errors.ASN1OverflowError("Number too long to decode.");
    }
    // TODO: Could you do allocUnsafe?
    const ret = Buffer.alloc(4, (value[0] >= 0b10000000) ? 0xFF : 0x00);
    ret.set(value, (4 - value.length));
    return ret.readInt32BE();
}
