import { OID_IRI } from "../../../macros";
import convertTextToBytes from "../../../utils/convertTextToBytes";

export default
function encodeOIDIRI (value: OID_IRI): Uint8Array {
    return convertTextToBytes(value);
}
