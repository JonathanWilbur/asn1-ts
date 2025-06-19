/**
 * @summary Decodes a single-precision IEEE 754 floating-point number from a `Uint8Array`
 * @param {Uint8Array} bytes - The bytes representing the single-precision float.
 * @returns {number} The decoded floating-point number.
 * @function
 */
export default
function decodeIEEE754SinglePrecisionFloat (bytes: Uint8Array): number {
    return new Float32Array(bytes.reverse().buffer)[0];
}
