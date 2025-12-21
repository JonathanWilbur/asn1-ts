import type { OID_IRI, SingleThreadUint8Array } from "../../../macros.mjs";
import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";

export default
function encodeOIDIRI (value: OID_IRI): SingleThreadUint8Array {
    return convertTextToBytes(value);
}
