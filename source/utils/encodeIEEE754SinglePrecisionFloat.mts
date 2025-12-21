import type { SingleThreadUint8Array } from "../macros.mjs";

/**
 * @summary Encodes a number as a single-precision IEEE 754 floating-point value in a `Uint8Array`
 * @param {number} value - The number to encode.
 * @returns {Uint8Array<ArrayBuffer>} The encoded single-precision float bytes.
 * @function
 */
export default
function encodeIEEE754SinglePrecisionFloat (value: number): SingleThreadUint8Array {
    return new Uint8Array(new Float32Array([ value ]).buffer).reverse();
}
