import type { RELATIVE_OID_IRI } from "../../../macros.mjs";
import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";

export default
function encodeRelativeOIDIRI (value: RELATIVE_OID_IRI): Uint8Array {
    return convertTextToBytes(value);
}
