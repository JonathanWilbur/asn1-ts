import ASN1Element from "../../../asn1";
import { SEQUENCE } from "../../../macros";

export default
function encodeSequence (value: SEQUENCE<ASN1Element>): Uint8Array {
    return Buffer.concat(value.map((v) => v.toBytes()));
}
