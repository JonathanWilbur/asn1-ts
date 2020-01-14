import ObjectIdentifier from "../../../types/ObjectIdentifier";
import * as errors from "../../../errors";
import splitBytesByContinuationBit from "../../../utils/splitBytesByContinuationBit";
import decodeObjectIdentifierNode from "./decodeObjectIdentifierNode";
import { OBJECT_IDENTIFIER } from "../../../macros";

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
        .map(decodeObjectIdentifierNode);

    return new ObjectIdentifier(firstTwoNodes.concat(additionalNodes));
}
