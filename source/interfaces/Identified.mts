import type { OBJECT_IDENTIFIER } from "../macros.mjs";

/**
 * Represents an object that is associated with an X.660 Object Identifier.
 */
export default
interface Identified {
    oid: OBJECT_IDENTIFIER;
}
