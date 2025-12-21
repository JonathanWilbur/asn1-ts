import type { INTEGER, SingleThreadUint8Array } from "../../../macros.mjs";
import { integerToBuffer } from "../../../utils/bigint.mjs";

export default
function encodeInteger (value: INTEGER): SingleThreadUint8Array {
    return integerToBuffer(value);
}
