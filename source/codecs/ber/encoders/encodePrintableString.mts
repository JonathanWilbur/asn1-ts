import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";
import type { PrintableString, SingleThreadUint8Array } from "../../../macros.mjs";

export default
function encodeNumericString (value: PrintableString): SingleThreadUint8Array {
    return convertTextToBytes(value);
}
