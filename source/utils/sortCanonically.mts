import type ASN1Element from "../asn1.mjs";
import { Buffer } from "node:buffer";

/**
 * @summary Sorts ASN.1 elements in canonical order as specified by ITU X.690 (2021), Section 11.6
 * @description
 * Used for DER and CER encoding of `SET OF` and similar types.
 * @param {ASN1Element[]} elements - The ASN.1 elements to sort.
 * @returns {ASN1Element[]} The sorted array of ASN.1 elements.
 * @function
 */
export default
function sortCanonically (elements: ASN1Element[]): ASN1Element[] {
    return elements.sort((a, b): number => {
        const aClassOrder = a.tagClass as number;
        const bClassOrder = b.tagClass as number;
        if (aClassOrder !== bClassOrder) {
            return (aClassOrder - bClassOrder);
        }
        /**
         * Buffer.compare() has the same semantics as the encoding comparison
         * algorithm described in ITU X.690 (2021), Section 11.6 (which builds
         * off of the conventions defined in Section 6.3).
         */
        return Buffer.compare(a.toBytes(), b.toBytes());
    });
}
