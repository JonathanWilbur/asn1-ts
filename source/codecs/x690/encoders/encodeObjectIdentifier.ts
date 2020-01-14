import encodeObjectIdentifierNode from "./encodeObjectIdentifierNode";
import concatenateBytes from "../../../utils/concatenateBytes";
import { OBJECT_IDENTIFIER } from "../../../macros";

export default
function encodeObjectIdentifier (value: OBJECT_IDENTIFIER): Uint8Array {
    const numbers: number[] = value.nodes;
    const pre: Uint8Array = new Uint8Array([ ((numbers[0] * 40) + numbers[1]) ]);
    const post: Uint8Array[] = numbers
        .slice(2)
        .map((n) => encodeObjectIdentifierNode(n));
    return concatenateBytes([pre].concat(post));
}
