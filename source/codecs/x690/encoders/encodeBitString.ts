import { BIT_STRING } from "../../../macros";
import packBits from "../../../utils/packBits";

export default
function encodeBitString (value: BIT_STRING): Uint8Array {
    if (value.length === 0) {
        return new Uint8Array([ 0 ]);
    }
    const ret: Uint8Array = new Uint8Array(((value.length >>> 3) + ((value.length % 8) ? 1 : 0)) + 1);
    ret[0] = (8 - (value.length % 8));
    if (ret[0] === 8) {
        ret[0] = 0;
    }
    ret.set(packBits(value), 1);
    return ret;
}
