import type Enstringable from "./Enstringable";
import type Destringable from "./Destringable";

/**
 * Represents something that can be converted to or from a string.
 */
export default
interface Stringable<T> extends Enstringable, Destringable<T> {

}
