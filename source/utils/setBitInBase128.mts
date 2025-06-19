/**
 * @summary Sets or clears a bit at a given index in a base-128 encoded `Uint8Array`
 * @param {Uint8Array} to - The base-128 encoded byte array to modify.
 * @param {number} bitIndex - The index of the bit to set or clear.
 * @param {boolean} value - True to set the bit, false to clear it.
 * @function
 */
export default
function setBit (to: Uint8Array, bitIndex: number, value: boolean): void {
    const byteIndex = to.length - (Math.floor(bitIndex / 7) + 1);
    if (value) {
        to[byteIndex] |= (0x01 << (bitIndex % 7));
    } else {
        to[byteIndex] &= ~(0x01 << (bitIndex % 7));
    }
}
