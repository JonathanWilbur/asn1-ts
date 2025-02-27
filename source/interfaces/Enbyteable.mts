/**
 * Represents something that can be converted to bytes.
 */
export default
interface Enbyteable {
    toBytes (): Uint8Array;
}
