import splitBytesByContinuationBit from "../../../utils/splitBytesByContinuationBit";
import decodeObjectIdentifierNode from "./decodeObjectIdentifierNode";
import * as errors from "../../../errors";
import { RELATIVE_OID } from "../../../macros";

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
        .map(decodeObjectIdentifierNode);
}
