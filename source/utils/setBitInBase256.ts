export default
function setBitInBase256 (to: Uint8Array, bitIndex: number, value: boolean): void {
    const byteIndex = (to.length - (Math.floor(bitIndex / 8) + 1));
    if (value) {
        to[byteIndex] |= (0x01 << (bitIndex % 8));
    } else {
        to[byteIndex] &= ~(0x01 << (bitIndex % 8));
    }
}
