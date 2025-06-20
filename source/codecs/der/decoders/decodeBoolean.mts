import * as errors from "../../../errors.mjs";
import type { BOOLEAN } from "../../../macros.mjs";

export default
function decodeBoolean (value: Uint8Array): BOOLEAN {
    if (value.length !== 1) {
        throw new errors.ASN1SizeError("BOOLEAN not one byte");
    }
    if ((value[0] !== 0x00) && (value[0] !== 0xFF)) {
        throw new errors.ASN1Error("BOOLEAN must be encoded as 0xFF or 0x00.");
    }
    return (value[0] !== 0);
}
