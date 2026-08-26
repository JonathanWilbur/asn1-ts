import * as errors from "../errors.mjs";
import { Buffer } from "node:buffer";
import type { SingleThreadBuffer } from "../macros.mjs";
import { MIN_SINT_32, MAX_SINT_32 } from "../values.mjs";

/**
 * @summary Encodes a number as a signed big-endian integer
 * @description
 * Throws if the value is out of the 32-bit signed integer range.
 * @param {number} value - The signed integer to encode.
 * @returns {Buffer<ArrayBuffer>} The encoded big-endian bytes.
 * @throws {ASN1OverflowError} If the value is out of range for a 32-bit signed integer.
 * @function
 */
export default
function encodeBigEndianSignedInteger (value: number): SingleThreadBuffer {
    if (value < MIN_SINT_32) {
        throw new errors.ASN1OverflowError(
            `Number ${value} too small to be encoded as a big-endian signed integer.`,
        );
    }
    if (value > MAX_SINT_32) {
        throw new errors.ASN1OverflowError(
            `Number ${value} too big to be encoded as a big-endian signed integer.`,
        );
    }

    if (value <= 127 && value >= -128) {
        const bytes = Buffer.allocUnsafe(1);
        bytes[0] = value;
        return bytes;
    } else if (value <= 32767 && value >= -32768) {
        const bytes = Buffer.allocUnsafe(2);
        bytes[0] = value >> 8;
        bytes[1] = value;
        return bytes;
    } else if (value <= 8388607 && value >= -8388608) {
        const bytes = Buffer.allocUnsafe(3);
        bytes[0] = value >> 16;
        bytes[1] = value >> 8;
        bytes[2] = value;
        return bytes;
    } else {
        const bytes = Buffer.allocUnsafe(4);
        bytes[0] = value >> 24;
        bytes[1] = value >> 16;
        bytes[2] = value >> 8;
        bytes[3] = value;
        return bytes;
    }
}
