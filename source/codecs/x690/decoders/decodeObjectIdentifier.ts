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

    const nodes: [ number, number ] = [ 0, 0 ];
    if (value[0] >= 0x50) {
        nodes[0] = 2;
        nodes[1] = (value[0] - 0x50);
    } else if (value[0] >= 0x28) {
        nodes[0] = 1;
        nodes[1] = (value[0] - 0x28);
    } else {
        nodes[0] = 0;
        nodes[1] = value[0];
    }

    if (value.length === 1) {
        return new ObjectIdentifier(nodes);
    }
    const additionalNodes: number[] = Array
        .from(splitBytesByContinuationBit(value.subarray(1)))
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
        .map((b) => ((b[0] === 0) ? b.subarray(1) : b))
        .map(decodeUnsignedBigEndianInteger);

    nodes.push(...additionalNodes);
    return new ObjectIdentifier(nodes);
}
