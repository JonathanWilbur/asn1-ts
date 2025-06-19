/**
 * @summary Splits a `Uint8Array` into chunks of up to 1000 bytes, as required for canonical ASN.1 encoding
 * @param {Uint8Array} value - The byte array to split.
 * @yields {Uint8Array} Chunks of up to 1000 bytes.
 * @function
 */
export default
function *splitOctetsCanonically (value: Uint8Array): IterableIterator<Uint8Array> {
    for (let i: number = 0; i < value.length; i += 1000) {
        // This will not throw an index error.
        yield value.subarray(i, i + 1000);
    }
}
