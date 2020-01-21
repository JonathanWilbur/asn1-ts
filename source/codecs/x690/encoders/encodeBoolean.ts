import { BOOLEAN } from "../../../macros";

export default
function encodeBoolean (value: BOOLEAN): Uint8Array {
    return new Uint8Array([ (value ? 0xFF : 0x00) ]);
}
