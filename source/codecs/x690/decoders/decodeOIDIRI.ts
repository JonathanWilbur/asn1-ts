import { OID_IRI } from "../../../macros";
import convertBytesToText from "../../../utils/convertBytesToText";

export default
function decodeOIDIRI (bytes: Uint8Array): OID_IRI {
    return convertBytesToText(bytes);
}
