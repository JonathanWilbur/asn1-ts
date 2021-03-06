import * as errors from "../../../errors";
import decodeSignedBigEndianInteger from "../../../utils/decodeSignedBigEndianInteger";
import { INTEGER } from "../../../macros";

export default
function decodeInteger (value: Uint8Array): INTEGER {
    if (value.length === 0) {
        throw new errors.ASN1SizeError("INTEGER encoded on zero bytes!");
    }
    if (value.length > 4) {
        throw new errors.ASN1OverflowError("INTEGER too long to decode.");
    }
    if (
        value.length > 2
        && (
            (value[0] === 0xFF && value[1] >= 0b10000000)
            || (value[0] === 0x00 && value[1] < 0b10000000)
        )
    ) {
        throw new errors.ASN1PaddingError("Unnecessary padding bytes on INTEGER or ENUMERATED.");
    }
    return decodeSignedBigEndianInteger(value.subarray(0));
}
