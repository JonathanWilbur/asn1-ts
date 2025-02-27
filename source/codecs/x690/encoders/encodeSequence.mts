import ASN1Element from "../../../asn1.mjs";
import { SEQUENCE } from "../../../macros.mjs";
import { Buffer } from "node:buffer";

export default
function encodeSequence (value: SEQUENCE<ASN1Element>): Uint8Array {
    return Buffer.concat(value.map((v) => v.toBytes()));
}
