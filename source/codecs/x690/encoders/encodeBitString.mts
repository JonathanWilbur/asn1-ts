import type { BIT_STRING, SingleThreadUint8Array } from "../../../macros.mjs";
import packBits from "../../../utils/packBits.mjs";

export default
function encodeBitString (value: BIT_STRING): SingleThreadUint8Array {
    const len: number = value.length;
    const ret = new Uint8Array(((len + 7) >> 3) + 1);
    ret[0] = (8 - (len & 7)) & 7;
    return packBits(value, ret, 1);
}
