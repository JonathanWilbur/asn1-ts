export default
function setBit (to: Uint8Array, bitIndex: number, value: boolean): void {
    const byteIndex = to.length - (Math.floor(bitIndex / 7) + 1);
    if (value) {
        to[byteIndex] |= (0x01 << (bitIndex % 7));
    } else {
        to[byteIndex] &= ~(0x01 << (bitIndex % 7));
    }
}
