export default
function encodeIEEE754SinglePrecisionFloat (value: number): Uint8Array {
    return new Uint8Array(new Float32Array([ value ]).buffer).reverse();
}
