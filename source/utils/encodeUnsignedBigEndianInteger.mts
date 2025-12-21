import * as errors from "../errors.mjs";
import { MIN_UINT_32, MAX_UINT_32 } from "../values.mjs";
import { Buffer } from "node:buffer";
import type { SingleThreadUint8Array } from "../macros.mjs";

/**
 * @summary Encodes a number as an unsigned big-endian integer
 * @description
 * Throws if the value is out of the 32-bit unsigned integer range.
 * @param {number} value - The unsigned integer to encode.
 * @returns {Uint8Array<ArrayBuffer>} The encoded big-endian bytes.
 * @throws {ASN1OverflowError} If the value is out of range for a 32-bit unsigned integer.
 * @function
 */
export default
function encodeUnsignedBigEndianInteger (value: number): SingleThreadUint8Array {
    if (value < MIN_UINT_32) {
        throw new errors.ASN1OverflowError(
            `Number ${value} too small to be encoded as a big-endian unsigned integer.`,
        );
    }
    if (value > MAX_UINT_32) {
        throw new errors.ASN1OverflowError(
            `Number ${value} too big to be encoded as a big-endian unsigned integer.`,
        );
    }
    // TODO: Could you do allocUnsafe() here?
    const bytes = Buffer.alloc(4);
    bytes.writeUInt32BE(value);
    let startOfNonPadding: number = 0;
    for (let i: number = 0; i < bytes.length - 1; i++) {
        if (bytes[i] === 0x00) {
            startOfNonPadding++;
        } else {
            break;
        }
    }
    return bytes.subarray(startOfNonPadding);
}
