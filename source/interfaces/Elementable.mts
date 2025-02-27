import type Deelementable from "./Deelementable.mjs";
import type Enelementable from "./Enelementable.mjs";

/**
 * Represents something that can be converted to or from an Element.
 */
export default
interface Elementable extends Deelementable, Enelementable {

}
