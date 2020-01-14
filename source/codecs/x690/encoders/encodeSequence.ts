import ASN1Element from "../../../asn1";
import concatenateBytes from "../../../utils/concatenateBytes";
import { SEQUENCE } from "../../../macros";

export default
function encodeSequence (value: SEQUENCE<ASN1Element>): Uint8Array {
    return concatenateBytes(value.map((v) => v.toBytes()));
}
