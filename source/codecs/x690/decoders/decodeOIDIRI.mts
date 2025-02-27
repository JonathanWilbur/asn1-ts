import { OID_IRI } from "../../../macros.mjs";
import convertBytesToText from "../../../utils/convertBytesToText.mjs";

export default
function decodeOIDIRI (bytes: Uint8Array): OID_IRI {
    return convertBytesToText(bytes);
}
