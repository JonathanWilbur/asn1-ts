import type ASN1Element from "../asn1.mjs";

/**
 * Compares SET OF elements according to ITU X.690-2015, Section 11.6. For use
 * with ECMAScript's `Array.prototype.sort()` function.
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
