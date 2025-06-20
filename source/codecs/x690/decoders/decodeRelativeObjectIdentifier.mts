import * as errors from "../../../errors.mjs";
import type { RELATIVE_OID } from "../../../macros.mjs";

export default
function decodeRelativeObjectIdentifier (value: Uint8Array): RELATIVE_OID {
    if (value.length === 0) {
        return [];
    }
    if (value.length > 1 && value[value.length - 1] & 0b10000000) {
        throw new errors.ASN1TruncationError("Relative OID was truncated.");
    }
    const nodes: number[] = [];
    let current_node: number = 0;
    for (let i = 0; i < value.length; i++) {
        const byte = value[i];
        if ((byte === 0x80) && (current_node === 0)) {
            throw new errors.ASN1PaddingError("Prohibited padding on RELATIVE-OID node.");
        }
        current_node <<= 7;
        current_node += (byte & 0b0111_1111);
        if ((byte & 0b1000_0000) === 0) {
            nodes.push(current_node);
            current_node = 0;
        }
    }
    return nodes;
}
