import type { DURATION } from "../../../macros.mjs";
import decodeDuration from "../../ber/decoders/decodeDuration.mjs";

export default
function decodeDurationDER (bytes: Uint8Array): DURATION {
    return decodeDuration(bytes, true);
}
