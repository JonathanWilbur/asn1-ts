import ObjectIdentifier from "../../../types/ObjectIdentifier.mjs";
import type { OBJECT_IDENTIFIER } from "../../../macros.mjs";

export default
function decodeObjectIdentifier (value: Uint8Array): OBJECT_IDENTIFIER {
    return ObjectIdentifier.fromBytes(value);
}
