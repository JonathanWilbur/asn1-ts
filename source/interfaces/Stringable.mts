import type Enstringable from "./Enstringable.mjs";
import type Destringable from "./Destringable.mjs";

/**
 * Represents something that can be converted to or from a string.
 */
export default
interface Stringable<T> extends Enstringable, Destringable<T> {

}
