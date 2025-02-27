
export default
function getBitFromBase128 (from: Uint8Array, bitIndex: number): boolean {
    const byteIndex: number = (from.length - (Math.floor(bitIndex / 7) + 1));
    return ((from[byteIndex] & (0x01 << (bitIndex % 7))) > 0);
}
