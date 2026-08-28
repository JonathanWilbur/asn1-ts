import * as errors from "../../../errors.mjs";
import type { RELATIVE_OID } from "../../../macros.mjs";

export default
function decodeRelativeObjectIdentifier (value: Uint8Array, typeName = "RELATIVE-OID"): RELATIVE_OID {
    const len: number = value.length;
    if (len === 0) {
        return [];
    }
    if (len === 1) {
        const b0: number = value[0];
        if (b0 < 0x80) {
            return [ b0 ];
        }
        if (b0 === 0x80) {
            throw new errors.ASN1PaddingError(`Prohibited padding on ${typeName} node.`);
        }
        return [];
    }
    if (value[len - 1] >= 0x80) {
        throw new errors.ASN1TruncationError(`${typeName} was truncated.`);
    }

    let nodeCount: number = 0;
    for (let j: number = 0; j < len; j++) {
        if (value[j] < 0x80) {
            nodeCount++;
        }
    }
    const nodes: number[] = new Array(nodeCount);
    if (nodeCount === len) {
        for (let j: number = 0; j < len; j++) {
            nodes[j] = value[j];
        }
        return nodes;
    }

    let n: number = 0;
    let i: number = 0;
    decode: while (i < len) {
        const b0: number = value[i];
        if (b0 < 0x80) {
            nodes[n++] = b0;
            i++;
            continue;
        }
        if (b0 === 0x80) {
            throw new errors.ASN1PaddingError(`Prohibited padding on ${typeName} node.`);
        }
        const b1: number = value[++i];
        if (b1 < 0x80) {
            nodes[n++] = ((b0 & 0x7F) << 7) | b1;
            i++;
            continue;
        }
        const b2: number = value[++i];
        if (b2 < 0x80) {
            nodes[n++] = ((b0 & 0x7F) << 14) | ((b1 & 0x7F) << 7) | b2;
            i++;
            continue;
        }
        const b3: number = value[++i];
        if (b3 < 0x80) {
            nodes[n++] = ((b0 & 0x7F) << 21) | ((b1 & 0x7F) << 14) | ((b2 & 0x7F) << 7) | b3;
            i++;
            continue;
        }
        // 4 bytes already consumed (28 bits). At most 4 more reach 56 bits,
        // which is enough for Number.MAX_SAFE_INTEGER (53 bits).
        let current_node: number = ((b0 & 0x7F) << 21)
            | ((b1 & 0x7F) << 14)
            | ((b2 & 0x7F) << 7)
            | (b3 & 0x7F);
        for (let extra: number = 0; extra < 4; extra++) {
            if (++i >= len) {
                throw new errors.ASN1TruncationError(`${typeName} was truncated.`);
            }
            const byte: number = value[i];
            current_node = (current_node * 128) + (byte & 0x7F);
            if (byte < 0x80) {
                if (current_node > Number.MAX_SAFE_INTEGER) {
                    throw new errors.ASN1OverflowError(`${typeName} node too large to decode.`);
                }
                nodes[n++] = current_node;
                i++;
                continue decode;
            }
        }
        throw new errors.ASN1OverflowError(`${typeName} node too large to decode.`);
    }
    return nodes;
}
