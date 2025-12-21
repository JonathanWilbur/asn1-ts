import type { SingleThreadUint8Array, TIME } from "../../../macros.mjs";
import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";

export default
function encodeTime (value: TIME): SingleThreadUint8Array {
    return convertTextToBytes(value.replace(/,/g, "."));
}
