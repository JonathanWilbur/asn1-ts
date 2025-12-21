import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";
import type { SingleThreadUint8Array, VisibleString } from "../../../macros.mjs";

export default
function encodeVisibleString (value: VisibleString): SingleThreadUint8Array {
    return convertTextToBytes(value);
}
