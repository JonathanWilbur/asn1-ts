import { ASN1Element } from "../asn1";

/**
 * Represents something that can be generated from an ASN.1 element.
 */
export default
interface Deelementable {
    fromElement (el: ASN1Element): void;
}
