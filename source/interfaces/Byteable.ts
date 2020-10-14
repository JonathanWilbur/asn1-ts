import type Enbyteable from "./Enbyteable";
import type Debyteable from "./Debyteable";

/**
 * Represents something that can be converted to and from bytes.
 */
export default
interface Byteable extends Enbyteable, Debyteable {

}
