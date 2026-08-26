import ASN1Element from "../../../asn1.mjs";
import type { SEQUENCE, SingleThreadUint8Array } from "../../../macros.mjs";
import { Buffer } from "node:buffer";

export default
function encodeSequence (value: SEQUENCE<ASN1Element>): SingleThreadUint8Array {
    let len: number = 0;
    const n: number = value.length;
    for (let i: number = 0; i < n; i++) {
        len += value[i].tlvLength();
    }
    const buf = Buffer.allocUnsafe(len);
    let offset: number = 0;
    for (let i: number = 0; i < n; i++) {
        offset = value[i].encodeInto(buf, offset);
    }
    return buf;
}
