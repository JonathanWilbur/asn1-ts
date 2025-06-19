/**
 * @summary Decodes a double-precision IEEE 754 floating-point number from a `Uint8Array`
 * @description
 * @param {Uint8Array} bytes - The bytes representing the double-precision float.
 * @returns {number} The decoded floating-point number.
 * @function
 */
export default
function decodeIEEE754DoublePrecisionFloat (bytes: Uint8Array): number {
    return new Float64Array(bytes.reverse().buffer)[0];
}
