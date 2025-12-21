import * as errors from "../errors.mjs";
import type { SingleThreadUint8Array } from "../macros.mjs";
import { MIN_SINT_32, MAX_SINT_32 } from "../values.mjs";

/**
 * @summary Encodes a number as a signed big-endian integer
 * @description
 * Throws if the value is out of the 32-bit signed integer range.
 * @param {number} value - The signed integer to encode.
 * @returns {Uint8Array<ArrayBuffer>} The encoded big-endian bytes.
 * @throws {ASN1OverflowError} If the value is out of range for a 32-bit signed integer.
 * @function
 */
export default
function encodeBigEndianSignedInteger (value: number): SingleThreadUint8Array {
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
        return new Uint8Array([
            (value & 255),
        ]);
    } else if (value <= 32767 && value >= -32768) {
        return new Uint8Array([
            ((value >> 8) & 255),
            (value & 255),
        ]);
    } else if (value <= 8388607 && value >= -8388608) {
        return new Uint8Array([
            ((value >> 16) & 255),
            ((value >> 8) & 255),
            (value & 255),
        ]);
    } else {
        return new Uint8Array([
            ((value >> 24) & 255),
            ((value >> 16) & 255),
            ((value >> 8) & 255),
            (value & 255),
        ]);
    }
}
