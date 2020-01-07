import * as errors from "../errors";

export default
function decodeUnsignedBigEndianInteger (value: Uint8Array): number {
    if (value.length === 0) {
        return 0;
    }
    if (value.length > 4) {
        throw new errors.ASN1OverflowError("Number too long to decode.");
    }
    const u8 = new Uint8Array(4);
    u8.set(value, (4 - value.length));
    return new Uint32Array(u8.reverse().buffer)[0];
}
