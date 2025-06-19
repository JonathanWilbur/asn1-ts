/**
 * @summary Calculates the number of bytes needed to encode a value in base-128, as used in ASN.1 OID encoding.
 * @param {number} numberOfBytes - The number of bytes in the original value.
 * @returns {number} The number of base-128 encoded bytes required.
 * @function
 */
export default
function base128Length (numberOfBytes: number): number {
    return Math.ceil(numberOfBytes * (8 / 7));
}
