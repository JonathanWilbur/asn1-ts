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
    return value.slice(startOfNonPadding);
}
