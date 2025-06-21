import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";
import type { ObjectDescriptor } from "../../../macros.mjs";

export default
function encodeObjectDescriptor (value: ObjectDescriptor): Uint8Array {
    const bytes: Uint8Array = convertTextToBytes(value);
    return bytes;
}
