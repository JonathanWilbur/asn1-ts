import { ASN1Element } from "../asn1";
import Deelementable from "./Deelementable";
import Enelementable from "./Enelementable";

/**
 * Represents something that can be converted to or from an Element.
 */
export default
interface Elementable<T, E extends ASN1Element> extends Deelementable<E, T>, Enelementable<E> {

}
