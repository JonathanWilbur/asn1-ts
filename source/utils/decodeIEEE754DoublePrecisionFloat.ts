export default
function decodeIEEE754DoublePrecisionFloat (bytes: Uint8Array): number {
    return new Float64Array(bytes.reverse().buffer)[0];
}
