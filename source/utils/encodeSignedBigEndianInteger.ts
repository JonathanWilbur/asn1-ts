import * as errors from "../errors";
import { MIN_SINT_32, MAX_SINT_32 } from "../values";

// TODO: Consider using typed arrays instead.
export default
function encodeBigEndianSignedInteger (value: number): Uint8Array {
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
