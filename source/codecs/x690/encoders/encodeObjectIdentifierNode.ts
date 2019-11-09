export default
function encodeObjectIdentifierNode (value: number): Uint8Array {
    if (value < 128) {
        return new Uint8Array([ value ]);
    }
    const encodedOIDNode: number[] = [];
    while (value !== 0) {
        const numberBytes: number[] = [
            (value & 255),
            ((value >>> 8) & 255),
            ((value >>> 16) & 255),
            ((value >>> 24) & 255),
        ];
        if ((numberBytes[0] & 0x80) === 0) {
            numberBytes[0] |= 0x80;
        }
        encodedOIDNode.unshift(numberBytes[0]);
        value >>= 7;
    }
    encodedOIDNode[encodedOIDNode.length - 1] &= 0x7F;
    return new Uint8Array(encodedOIDNode);
}
