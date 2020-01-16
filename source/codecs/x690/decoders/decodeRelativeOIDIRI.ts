import { RELATIVE_OID_IRI } from "../../../macros";
import convertBytesToText from "../../../utils/convertBytesToText";

export default
function decodeRelativeOIDIRI (bytes: Uint8Array): RELATIVE_OID_IRI {
    return convertBytesToText(bytes);
}
