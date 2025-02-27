/**
 * Represents something that can be generated from a string.
 */
export default
interface Destringable<T> {
    fromString (str: string): T;
}
