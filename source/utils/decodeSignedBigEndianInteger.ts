import * as errors from "../errors";

export default
function decodeSignedBigEndianInteger (value: Uint8Array): number {
    if (value.length === 0) {
        return 0;
    }
    if (value.length > 4) {
        throw new errors.ASN1OverflowError("Number too long to decode.");
    }
    const u8 = new Uint8Array(4);
    if (value[0] >= 0b10000000) {
        u8.fill(0xFF);
    }
    u8.set(value, (4 - value.length));
    return Buffer.from(u8).readInt32BE();
}
