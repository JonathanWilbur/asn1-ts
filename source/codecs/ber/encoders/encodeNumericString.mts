import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";
import type { NumericString } from "../../../macros.mjs";

export default
function encodeNumericString (value: NumericString): Uint8Array {
    const bytes: Uint8Array = convertTextToBytes(value);
    return bytes;
}
