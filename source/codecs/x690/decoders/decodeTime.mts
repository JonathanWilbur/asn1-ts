import type { TIME } from "../../../macros.mjs";
import convertBytesToText from "../../../utils/convertBytesToText.mjs";

export default
function decodeTime (bytes: Uint8Array): TIME {
    return convertBytesToText(bytes);
}
