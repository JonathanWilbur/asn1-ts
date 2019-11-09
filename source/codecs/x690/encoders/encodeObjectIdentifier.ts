import { ObjectIdentifier } from "../../../types/objectidentifier";
import encodeObjectIdentifierNode from "./encodeObjectIdentifierNode";
import concatenateBytes from "../../../concatenateBytes";

export default
function encodeObjectIdentifier (value: ObjectIdentifier): Uint8Array {
    const numbers: number[] = value.nodes;
    const pre: Uint8Array = new Uint8Array([ ((numbers[0] * 40) + numbers[1]) ]);
    const post: Uint8Array[] = numbers
        .slice(2)
        .map((n) => encodeObjectIdentifierNode(n));
    return concatenateBytes([pre].concat(post));
}
