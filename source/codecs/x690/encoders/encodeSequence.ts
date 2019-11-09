import { ASN1Element } from "../../../asn1";
import concatenateBytes from "../../../concatenateBytes";

export default
function encodeSequence (value: ASN1Element[]): Uint8Array {
    return concatenateBytes(value.map((v) => v.toBytes()));
}
