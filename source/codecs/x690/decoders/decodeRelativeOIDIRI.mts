import type { RELATIVE_OID_IRI } from "../../../macros.mjs";
import convertBytesToText from "../../../utils/convertBytesToText.mjs";

export default
function decodeRelativeOIDIRI (bytes: Uint8Array): RELATIVE_OID_IRI {
    return convertBytesToText(bytes);
}
