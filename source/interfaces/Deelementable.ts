import { ASN1Element } from "../asn1";

/**
 * Represents something that can be generated from an ASN.1 element.
 */
export default
interface Deelementable<E extends ASN1Element, T> {
    fromElement (el: E): T;
}
