import ObjectIdentifier from "../../../types/ObjectIdentifier";
import * as errors from "../../../errors";
import splitBytesByContinuationBit from "../../../utils/splitBytesByContinuationBit";
import { OBJECT_IDENTIFIER } from "../../../macros";
import { decodeUnsignedBigEndianInteger, decodeBase128 } from "../../../utils";

export default
function decodeObjectIdentifier (value: Uint8Array): OBJECT_IDENTIFIER {
    if (value.length === 0) {
        throw new errors.ASN1TruncationError("Encoded value was too short to be an OBJECT IDENTIFIER!");
    }

    if (value.length > 1 && value[value.length - 1] & 0b10000000) {
        throw new errors.ASN1TruncationError("OID was truncated.");
    }

    const firstTwoNodes: [ number, number ] = [ 0, 0 ];
    if (value[0] >= 0x50) {
        firstTwoNodes[0] = 2;
        firstTwoNodes[1] = (value[0] - 0x50);
    } else if (value[0] >= 0x28) {
        firstTwoNodes[0] = 1;
        firstTwoNodes[1] = (value[0] - 0x28);
    } else {
        firstTwoNodes[0] = 0;
        firstTwoNodes[1] = value[0];
    }

    if (value.length === 1) {
        return new ObjectIdentifier(firstTwoNodes);
    }
    const additionalNodes: number[] = Array
        .from(splitBytesByContinuationBit(value.slice(1)))
        .map((b) => {
            if (b.length > 1 && b[0] === 0x80) {
                throw new errors.ASN1PaddingError("Prohibited padding on OBJECT IDENTIFIER node.");
            }
            return decodeBase128(b);
        })
        /**
         * This has to be done, because decodeBase128() does not know how many
         * leading zero bits are extraneous.
         */
        .map((b) => ((b[0] === 0) ? b.slice(1) : b))
        .map(decodeUnsignedBigEndianInteger);

    return new ObjectIdentifier(firstTwoNodes.concat(additionalNodes));
}
