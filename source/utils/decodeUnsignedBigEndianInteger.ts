import * as errors from "../errors";

export default
function decodeUnsignedBigEndianInteger (value: Uint8Array): number {
    if (value.length === 0) {
        return 0;
    }
    if (value.length > 4) {
        throw new errors.ASN1OverflowError(`Number on ${value.length} bytes is too long to decode.`);
    }
    const u8 = new Uint8Array(4);
    u8.set(value, (4 - value.length));
    return Buffer.from(u8).readUInt32BE();
}
