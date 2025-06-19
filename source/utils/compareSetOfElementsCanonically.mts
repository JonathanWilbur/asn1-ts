import type ASN1Element from "../asn1.mjs";

/**
 * @summary Compares two ASN.1 `SET OF` elements for canonical order as per ITU X.690-2015, Section 11.6.
 * @description
 * Intended for use with `Array.prototype.sort()` for DER/CER encoding.
 *
 * @param {ASN1Element} a - The first ASN.1 element to compare.
 * @param {ASN1Element} b - The second ASN.1 element to compare.
 * @returns {number} Negative if a < b, positive if a > b, zero if equal.
 * @function
 */
export default
function compareSetOfElementsCanonically (a: ASN1Element, b: ASN1Element): number {
    const longestLength: number = (a.value.length > b.value.length)
        ? a.value.length
        : b.value.length;
    for (let i: number = 0; i < longestLength; i++) {
        const x: number = a.value[i] ?? 0;
        const y: number = b.value[i] ?? 0;
        if (x !== y) {
            return (x - y);
        }
    }
    return 0;
}
