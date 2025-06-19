/**
 * @summary Gets the value of a bit at a given index from a base-128 encoded `Uint8Array`
 * @description
 * @param {Uint8Array} from - The base-128 encoded byte array.
 * @param {number} bitIndex - The index of the bit to retrieve.
 * @returns {boolean} True if the bit is set, false otherwise.
 * @function
 */
export default
function getBitFromBase128 (from: Uint8Array, bitIndex: number): boolean {
    const byteIndex: number = (from.length - (Math.floor(bitIndex / 7) + 1));
    return ((from[byteIndex] & (0x01 << (bitIndex % 7))) > 0);
}
