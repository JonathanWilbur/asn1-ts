import type { BOOLEAN, SingleThreadUint8Array } from "../../../macros.mjs";

export default
function encodeBoolean (value: BOOLEAN): SingleThreadUint8Array {
    // While a little more verbose, benchmarks show this to be faster than the single-line return.
    const ret = new Uint8Array(1);
    ret[0] = value ? 0xFF : 0x00;
    return ret;
}
