import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";
import type { GeneralString } from "../../../macros.mjs";

export default
function encodeGeneralString (value: GeneralString): Uint8Array {
    const bytes: Uint8Array = convertTextToBytes(value);
    return bytes;
}
