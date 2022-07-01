import * as errors from "../errors";

export default
function decodeSignedBigEndianInteger (value: Uint8Array): number {
    if (value.length === 0) {
        return 0;
    }
    if (value.length > 4) {
        throw new errors.ASN1OverflowError("Number too long to decode.");
    }
    const ret = Buffer.alloc(4, (value[0] >= 0b10000000) ? 0xFF : 0x00);
    ret.set(value, (4 - value.length));
    return ret.readInt32BE();
}
