/**
 * @summary Encodes a number as a double-precision IEEE 754 floating-point value in a `Uint8Array`
 * @param {number} value - The number to encode.
 * @returns {Uint8Array} The encoded double-precision float bytes.
 * @function
 */
export default
function encodeIEEE754DoublePrecisionFloat (value: number): Uint8Array {
    return new Uint8Array(new Float64Array([ value ]).buffer).reverse();
}
