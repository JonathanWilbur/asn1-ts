/**
 * @summary Removes leading padding bytes (0x80) from a `Uint8Array`
 * @param {Uint8Array} value - The byte array to trim.
 * @returns {Uint8Array} The trimmed byte array.
 * @function
 */
export default
function trimLeadingPaddingBytes (value: Uint8Array): Uint8Array {
    if (value.length <= 1) {
        return value;
    }
    let startOfNonPadding: number = 0;
    while (startOfNonPadding < value.length) {
        if (value[startOfNonPadding] === 0x80) {
            startOfNonPadding++;
        } else {
            break;
        }
    }
    return value.subarray(startOfNonPadding);
}
