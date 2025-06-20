import type { INTEGER } from "../../../macros.mjs";
import { integerToBuffer } from "../../../utils/bigint.mjs";

export default
function encodeInteger (value: INTEGER): Uint8Array {
    return integerToBuffer(value);
}
