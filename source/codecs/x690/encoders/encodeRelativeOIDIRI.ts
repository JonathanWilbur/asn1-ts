import { RELATIVE_OID_IRI } from "../../../macros";
import convertTextToBytes from "../../../utils/convertTextToBytes";

export default
function encodeRelativeOIDIRI (value: RELATIVE_OID_IRI): Uint8Array {
    return convertTextToBytes(value);
}
