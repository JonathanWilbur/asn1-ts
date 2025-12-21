import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";
import type { ObjectDescriptor, SingleThreadUint8Array } from "../../../macros.mjs";

export default
function encodeObjectDescriptor (value: ObjectDescriptor): SingleThreadUint8Array {
    return convertTextToBytes(value);
}
