import { BIT_STRING, FALSE_BIT } from "../../../macros";

// TODO: Replace with packBits
export default
function encodeBitString (value: BIT_STRING): Uint8Array {
    if (value.length === 0) {
        return new Uint8Array([ 0 ]);
    }
    const pre: number[] = [];
    pre.length = ((value.length >>> 3) + ((value.length % 8) ? 1 : 0)) + 1;
    for (let i = 0; i < value.length; i++) {
        if (value[i] === FALSE_BIT) {
            continue;
        }
        pre[((i >>> 3) + 1)] |= (0b10000000 >>> (i % 8));
    }
    pre[0] = (8 - (value.length % 8));
    if (pre[0] === 8) {
        pre[0] = 0;
    }
    return new Uint8Array(pre);
}
