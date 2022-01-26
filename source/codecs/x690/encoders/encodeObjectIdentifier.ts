import encodeUnsignedBigEndianInteger from "../../../utils/encodeUnsignedBigEndianInteger";
import encodeBase128 from "../../../utils/encodeBase128";
import { OBJECT_IDENTIFIER } from "../../../macros";

export default
function encodeObjectIdentifier (value: OBJECT_IDENTIFIER): Uint8Array {
    const numbers: number[] = value.nodes;
    const pre: Uint8Array = new Uint8Array([ ((numbers[0] * 40) + numbers[1]) ]);
    const post: Uint8Array[] = numbers
        .slice(2)
        .map(encodeUnsignedBigEndianInteger)
        .map(encodeBase128)
        .map((arc: Uint8Array): Uint8Array => ((arc[0] === 0x80) ? arc.slice(1) : arc));
    return Buffer.concat([pre, ...post]);
}
