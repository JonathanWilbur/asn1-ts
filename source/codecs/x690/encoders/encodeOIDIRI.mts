import { OID_IRI } from "../../../macros.mjs";
import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";

export default
function encodeOIDIRI (value: OID_IRI): Uint8Array {
    return convertTextToBytes(value);
}
