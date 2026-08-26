import type { SingleThreadUint8Array, UTCTime } from "../../../macros.mjs";
import { writeDec2 } from "../../../utils/asciiDecimal.mjs";

export default
function encodeUTCTime (value: UTCTime): SingleThreadUint8Array {
    const bytes: SingleThreadUint8Array = new Uint8Array(13);
    writeDec2(bytes, 0, value.getUTCFullYear() % 100);
    writeDec2(bytes, 2, value.getUTCMonth() + 1);
    writeDec2(bytes, 4, value.getUTCDate());
    writeDec2(bytes, 6, value.getUTCHours());
    writeDec2(bytes, 8, value.getUTCMinutes());
    writeDec2(bytes, 10, value.getUTCSeconds());
    bytes[12] = 0x5A; // Z
    return bytes;
}
