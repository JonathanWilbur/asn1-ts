/**
 * @summary Gets the value of a bit at a given index from a base-256 encoded `Uint8Array`
 * @description
 * Used for ASN.1 `BIT STRING` encoding.
 * @param {Uint8Array} from - The base-256 encoded byte array.
 * @param {number} bitIndex - The index of the bit to retrieve.
 * @returns {boolean} True if the bit is set, false otherwise.
 * @function
 */
export default
function getBit (from: Uint8Array, bitIndex: number): boolean {
    return ((from[from.length - (Math.floor(bitIndex / 8) + 1)] & (0x01 << (bitIndex % 8))) > 0);
}
