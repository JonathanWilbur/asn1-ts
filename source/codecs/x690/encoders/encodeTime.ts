import { TIME } from "../../../macros";
import convertTextToBytes from "../../../utils/convertTextToBytes";

export default
function encodeTime (value: TIME): Uint8Array {
    return convertTextToBytes(value);
}
