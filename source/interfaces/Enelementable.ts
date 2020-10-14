import type ASN1Element from "../asn1";

/**
 * Represents something that can be converted to an ASN.1 element.
 */
export default
interface Enelementable {
    toElement(): ASN1Element;
}
