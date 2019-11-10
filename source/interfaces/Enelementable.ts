import { ASN1Element } from "../asn1";

/**
 * Represents something that can be converted to an ASN.1 element.
 */
export default
interface Enelementable<E extends ASN1Element> {
    toElement(): E;
}
