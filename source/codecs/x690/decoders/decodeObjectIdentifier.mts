import ObjectIdentifier from "../../../types/ObjectIdentifier.mjs";
import * as errors from "../../../errors.mjs";
import { OBJECT_IDENTIFIER } from "../../../macros.mjs";

export default
function decodeObjectIdentifier (value: Uint8Array): OBJECT_IDENTIFIER {
    if (value.length === 0) {
        throw new errors.ASN1TruncationError("Encoded value was too short to be an OBJECT IDENTIFIER!");
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
    if (value[value.length - 1] & 0b10000000) {
        throw new errors.ASN1TruncationError("OID was truncated.");
    }

    let current_node: number = 0;
    for (let i = 1; i < value.length; i++) {
        const byte = value[i];
        if (current_node === 0) {
            if (byte < 128) {
                nodes.push(byte);
                continue;
            }
            if (byte === 0x80) {
                throw new errors.ASN1PaddingError("Prohibited padding on OBJECT IDENTIFIER node.");
            }
        }
        current_node <<= 7;
        current_node += (byte & 0b0111_1111);
        if ((byte & 0b1000_0000) === 0) {
            nodes.push(current_node);
            current_node = 0;
        }
    }
    return new ObjectIdentifier(nodes);
}
