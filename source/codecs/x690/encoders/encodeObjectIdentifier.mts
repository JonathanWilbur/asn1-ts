import type { OBJECT_IDENTIFIER, SingleThreadBuffer } from "../../../macros.mjs";

export default
function encodeObjectIdentifier (value: OBJECT_IDENTIFIER): SingleThreadBuffer {
    return value.toBytes();
}
