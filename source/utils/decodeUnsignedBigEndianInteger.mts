import * as errors from "../errors.mjs";
import { Buffer } from "node:buffer";

/**
 * @summary Decodes an unsigned big-endian integer from a `Uint8Array`
 * @description
 * Throws if the value is too large for a 32-bit unsigned integer.
 * @param {Uint8Array} value - The bytes representing the unsigned integer in big-endian order.
 * @returns {number} The decoded unsigned integer.
 * @throws {ASN1OverflowError} If the input is too long to decode as a 32-bit unsigned integer.
 * @function
 */
export default
function decodeUnsignedBigEndianInteger (value: Uint8Array): number {
    if (value.length === 0) {
        return 0;
    }
    if (value.length > 4) {
        throw new errors.ASN1OverflowError(`Number on ${value.length} bytes is too long to decode.`);
    }
    const ret = Buffer.alloc(4);
    ret.set(value, (4 - value.length));
    return ret.readUInt32BE();
}
