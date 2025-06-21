import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";
import type { VisibleString } from "../../../macros.mjs";

export default
function encodeVisibleString (value: VisibleString): Uint8Array {
    const bytes: Uint8Array = convertTextToBytes(value);
    return bytes;
}
