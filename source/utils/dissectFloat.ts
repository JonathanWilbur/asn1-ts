const EXPONENT_BITMASK: number = 0b0111_1111_1111_0000_0000_0000_0000_0000;

export default
function dissectFloat (value: number): { negative: boolean; exponent: number; mantissa: number } {
    const float: Float64Array = new Float64Array([ value ]);
    const uints: Uint32Array = new Uint32Array(float.buffer);
    // console.log(Array.from(uints).map((u): string => u.toString(16)).join(":"));
    const exponent: number = (((uints[1] & EXPONENT_BITMASK) >>> 20) - 1023 - 31);
    const mantissa: number = 0x8000_0000 + ((
        ((uints[1] & 0x000F_FFFF) << 11)
        | ((uints[0] & 0xFFE0_0000) >>> 21)
    ));
    return {
        negative: (value < 0),
        exponent,
        mantissa,
    };
}
