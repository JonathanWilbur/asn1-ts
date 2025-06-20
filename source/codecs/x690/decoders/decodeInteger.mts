import * as errors from "../../../errors.mjs";
import type { INTEGER } from "../../../macros.mjs";
import { bufferToInteger } from "../../../utils/bigint.mjs";
import { Buffer } from "node:buffer";

export default
function decodeInteger (value: Uint8Array): INTEGER {
    if (value.length === 0) {
        throw new errors.ASN1SizeError("INTEGER or ENUMERATED encoded on zero bytes");
    }
    if (
        value.length > 2
        && (
            (value[0] === 0xFF && value[1] >= 0b10000000)
            || (value[0] === 0x00 && value[1] < 0b10000000)
        )
    ) {
        // We slice so nefarious users cannot inundate logs with gigantic arbitrary integers.
        const buf = Buffer.from(value.slice(0, 16));
        throw new errors.ASN1PaddingError(
            "Unnecessary padding bytes on INTEGER or ENUMERATED. "
            + `First 16 bytes of the offending value were: 0x${buf.toString("hex")}`);
    }
    return bufferToInteger(value);
}
