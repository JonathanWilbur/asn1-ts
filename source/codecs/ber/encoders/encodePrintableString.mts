import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";
import type { PrintableString } from "../../../macros.mjs";

export default
function encodeNumericString (value: PrintableString): Uint8Array {
    const bytes: Uint8Array = convertTextToBytes(value);
    return bytes;
}
