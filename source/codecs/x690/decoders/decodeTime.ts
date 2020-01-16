import { TIME } from "../../../macros";
import convertBytesToText from "../../../utils/convertBytesToText";

export default
function decodeTime (bytes: Uint8Array): TIME {
    return convertBytesToText(bytes);
}
