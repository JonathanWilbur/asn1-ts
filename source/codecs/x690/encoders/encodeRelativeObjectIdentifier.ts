import concatenateBytes from "../../../concatenateBytes";
import encodeObjectIdentifierNode from "./encodeObjectIdentifierNode";

export default
function encodeRelativeObjectIdentifier (value: number[]): Uint8Array {
    return concatenateBytes(value.map(encodeObjectIdentifierNode));
}
