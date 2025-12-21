import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";
import type { NumericString, SingleThreadUint8Array } from "../../../macros.mjs";

export default
function encodeNumericString (value: NumericString): SingleThreadUint8Array {
    return convertTextToBytes(value);
}
