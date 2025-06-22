import type { OBJECT_IDENTIFIER } from "../../../macros.mjs";
import { Buffer } from "node:buffer";

export default
function encodeObjectIdentifier (value: OBJECT_IDENTIFIER): Buffer {
    return value.toBytes();
}
