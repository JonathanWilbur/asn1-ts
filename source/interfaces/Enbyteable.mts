import type { SingleThreadBuffer } from "../macros.mjs";

/**
 * Represents something that can be converted to bytes.
 */
export default
interface Enbyteable {
    toBytes (): SingleThreadBuffer;
}
