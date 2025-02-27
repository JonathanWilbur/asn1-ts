export default
function getBit (from: Uint8Array, bitIndex: number): boolean {
    return ((from[from.length - (Math.floor(bitIndex / 8) + 1)] & (0x01 << (bitIndex % 8))) > 0);
}
