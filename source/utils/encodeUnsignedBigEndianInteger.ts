import * as errors from "../errors";
import { MIN_UINT_32, MAX_UINT_32 } from "../values";

export default
function encodeUnsignedBigEndianInteger (value: number): Uint8Array {
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
    const bytes: Buffer = Buffer.alloc(4);
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
