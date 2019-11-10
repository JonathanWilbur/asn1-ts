/**
 * Represents something that can be generated from bytes.
 */
export default
interface Debyteable {
    /**
     * @param bytes The stream of bytes to read.
     * @returns The number of bytes read.
     */
    fromBytes (bytes: Uint8Array): number;
}
