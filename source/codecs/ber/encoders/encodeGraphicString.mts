import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";
import type { GraphicString, SingleThreadUint8Array } from "../../../macros.mjs";

export default
function encodeGraphicString (value: GraphicString): SingleThreadUint8Array {
    return convertTextToBytes(value);
}
