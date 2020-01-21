import * as errors from "../../../errors";
import { BOOLEAN } from "../../../macros";

export default
function decodeBoolean (value: Uint8Array): BOOLEAN {
    if (value.length !== 1) {
        throw new errors.ASN1SizeError("BOOLEAN not one byte");
    }
    return (value[0] !== 0);
}
