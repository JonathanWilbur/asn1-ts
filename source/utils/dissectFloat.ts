export default
function dissectFloat (value: number): { negative: boolean; exponent: number; mantissa: number } {
    const float = new Float64Array(1);
    const bytes = new Uint8Array(float.buffer);
    float[0] = value;
    const sign: number = bytes[7] >> 7;
    const exponent: number = ((((bytes[7] & 0x7f) << 4) | (bytes[6] >> 4)) - 0x3ff);
    bytes[7] = 0x3f;
    bytes[6] |= 0xf0;
    return {
        negative: (sign > 0),
        exponent,
        mantissa: float[0],
    };
}
