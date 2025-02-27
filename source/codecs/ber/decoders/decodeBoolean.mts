import * as errors from "../../../errors.mjs";
import { BOOLEAN } from "../../../macros.mjs";

export default
function decodeBoolean (value: Uint8Array): BOOLEAN {
    if (value.length !== 1) {
        throw new errors.ASN1SizeError("BOOLEAN not one byte");
    }
    return (value[0] !== 0);
}
