export default
function encodeIEEE754DoublePrecisionFloat (value: number): Uint8Array {
    return new Uint8Array(new Float64Array([ value ]).buffer).reverse();
}
