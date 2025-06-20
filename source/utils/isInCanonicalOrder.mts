import type ASN1Element from "../asn1.mjs";
import { ASN1TagClass, CANONICAL_TAG_CLASS_ORDERING } from "../values.mjs";

/**
 * @summary Checks if `SET OF` ASN.1 elements is in canonical order as per ITU X.690
 * @description
 * Used for validating DER/CER `SET OF` encodings.
 * @param {ASN1Element[]} elements - The ASN.1 elements to check.
 * @returns {boolean} True if the elements are in canonical order, false otherwise.
 * @function
 */
export default
function isInCanonicalOrder (elements: ASN1Element[]): boolean {
    let previousTagClass: ASN1TagClass | null = null;
    let previousTagNumber: number | null = null;
    return (elements.every((element): boolean => {
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
    }));
}
