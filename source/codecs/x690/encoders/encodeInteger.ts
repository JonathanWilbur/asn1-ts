import { INTEGER } from "../../../macros";
import { integerToBuffer } from "../../../utils/bigint";

export default
function encodeInteger (value: INTEGER): Uint8Array {
    return integerToBuffer(value);
}
