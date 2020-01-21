import splitBytesByContinuationBit from "../../../utils/splitBytesByContinuationBit";
import * as errors from "../../../errors";
import { RELATIVE_OID } from "../../../macros";
import { decodeUnsignedBigEndianInteger, decodeBase128 } from "../../../utils";

export default
function decodeRelativeObjectIdentifier (value: Uint8Array): RELATIVE_OID {
    if (value.length === 0) {
        return [];
    }
    if (value.length > 1 && value[value.length - 1] & 0b10000000) {
        throw new errors.ASN1TruncationError("Relative OID was truncated.");
    }
    return Array
        .from(splitBytesByContinuationBit(value))
        .map((b) => {
            if (b.length > 1 && b[0] === 0x80) {
                throw new errors.ASN1PaddingError("Prohibited padding on RELATIVE-OID node.");
            }
            return b;
        })
        .map(decodeBase128)
        /**
         * This has to be done, because decodeBase128() does not know how many
         * leading zero bits are extraneous.
         */
        .map((b) => ((b[0] === 0) ? b.slice(1) : b))
        .map(decodeUnsignedBigEndianInteger);
}
