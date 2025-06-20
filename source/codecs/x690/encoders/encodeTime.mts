import type { TIME } from "../../../macros.mjs";
import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";

export default
function encodeTime (value: TIME): Uint8Array {
    return convertTextToBytes(value.replace(/,/g, "."));
}
