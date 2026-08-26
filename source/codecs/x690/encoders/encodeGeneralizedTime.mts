import type { GeneralizedTime, SingleThreadUint8Array } from "../../../macros.mjs";
import { writeDec2, writeDec4 } from "../../../utils/asciiDecimal.mjs";

export default
function encodeGeneralizedTime (value: GeneralizedTime): SingleThreadUint8Array {
    const bytes: SingleThreadUint8Array = new Uint8Array(15);
    writeDec4(bytes, 0, value.getUTCFullYear());
    writeDec2(bytes, 4, value.getUTCMonth() + 1);
    writeDec2(bytes, 6, value.getUTCDate());
    writeDec2(bytes, 8, value.getUTCHours());
    writeDec2(bytes, 10, value.getUTCMinutes());
    writeDec2(bytes, 12, value.getUTCSeconds());
    bytes[14] = 0x5A; // Z
    return bytes;
}
