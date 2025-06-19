import type ASN1Element from "../asn1.mjs";

/**
 * @summary Checks if all ASN.1 elements in an array have unique tag class and tag number combinations
 * @description
 * Useful for validating ASN.1 `CHOICE` and `SET` types.
 * @param {ASN1Element[]} elements - The ASN.1 elements to check.
 * @returns {boolean} True if all elements are uniquely tagged, false otherwise.
 * @function
 */
export default
function isUniquelyTagged (elements: ASN1Element[]): boolean {
    const finds: Set<number> = new Set<number>([]);
    for (let i = 0; i < elements.length; i++) {
        // Theoretically, it is possible to supply a ridiculously large
        // tagNumber that would make this incorrectly flag it as duplicate, but
        // large tag numbers (.e.g > 1000000) should never be used.
        const key: number = (
            (elements[i].tagClass << 30) // Bit shifts are mod 32, FYI.
            + elements[i].tagNumber // Technically, we _should_ mod 30 this, but its not necessary.
        );
        if (finds.has(key)) {
            return false;
        }
        finds.add(key);
    }
    return true;
}
