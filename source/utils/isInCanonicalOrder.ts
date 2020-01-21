import ASN1Element from "../asn1";
import { ASN1TagClass, CANONICAL_TAG_CLASS_ORDERING } from "../values";

export default
function isInCanonicalOrder (elements: ASN1Element[]): boolean {
    let previousTagClass: ASN1TagClass | null = null;
    let previousTagNumber: number | null = null;
    if (!elements.every((element): boolean => {
        // Checks that the tag classes are in canonical order
        if (
            previousTagClass !== null
            && element.tagClass !== previousTagClass
            && CANONICAL_TAG_CLASS_ORDERING.indexOf(element.tagClass)
            <= CANONICAL_TAG_CLASS_ORDERING.indexOf(previousTagClass)
        ) return false;
        // Checks that the tag numbers are in canonical order
        if (element.tagClass !== previousTagClass) previousTagNumber = null;
        if (previousTagNumber !== null && element.tagNumber < previousTagNumber) return false;
        previousTagClass = element.tagClass;
        previousTagNumber = element.tagNumber;
        return true;
    })) return false;
    return true;
}
