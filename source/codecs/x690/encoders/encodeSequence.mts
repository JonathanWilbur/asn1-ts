import ASN1Element from "../../../asn1.mjs";
import type { SEQUENCE, SingleThreadUint8Array } from "../../../macros.mjs";
import { Buffer } from "node:buffer";

export default
function encodeSequence (value: SEQUENCE<ASN1Element>): SingleThreadUint8Array {
    return Buffer.concat(value.map((v) => v.toBytes()));
}
