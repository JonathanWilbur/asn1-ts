import type Enbyteable from "./Enbyteable.mjs";
import type Debyteable from "./Debyteable.mjs";

/**
 * Represents something that can be converted to and from bytes.
 */
export default
interface Byteable extends Enbyteable, Debyteable {

}
