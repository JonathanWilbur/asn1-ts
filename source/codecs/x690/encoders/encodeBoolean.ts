export default
function encodeBoolean (value: boolean): Uint8Array {
    return new Uint8Array([ (value ? 0xFF : 0x00) ]);
}
