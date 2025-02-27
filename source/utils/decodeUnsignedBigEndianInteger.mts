import * as errors from "../errors.mjs";
import { Buffer } from "node:buffer";

export default
function decodeUnsignedBigEndianInteger (value: Uint8Array): number {
    if (value.length === 0) {
        return 0;
    }
    if (value.length > 4) {
        throw new errors.ASN1OverflowError(`Number on ${value.length} bytes is too long to decode.`);
    }
    const ret = Buffer.alloc(4);
    ret.set(value, (4 - value.length));
    return ret.readUInt32BE();
}
