export default
function decodeIEEE754SinglePrecisionFloat (bytes: Uint8Array): number {
    return new Float32Array(bytes.reverse().buffer)[0];
}
