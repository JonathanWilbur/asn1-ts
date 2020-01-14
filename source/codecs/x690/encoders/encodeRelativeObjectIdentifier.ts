import concatenateBytes from "../../../utils/concatenateBytes";
import encodeObjectIdentifierNode from "./encodeObjectIdentifierNode";
import { RELATIVE_OID } from "../../../macros";

export default
function encodeRelativeObjectIdentifier (value: RELATIVE_OID): Uint8Array {
    return concatenateBytes(value.map(encodeObjectIdentifierNode));
}
