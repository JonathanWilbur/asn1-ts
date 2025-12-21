import type { BOOLEAN, SingleThreadUint8Array } from "../../../macros.mjs";

export default
function encodeBoolean (value: BOOLEAN): SingleThreadUint8Array {
    return new Uint8Array([ (value ? 0xFF : 0x00) ]);
}
