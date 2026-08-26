/**
 * Represents something that can be generated from bytes.
 */
export default
interface Debyteable {
    /**
     * @param bytes The stream of bytes to read.
     * @param zeroCopy If true, store a view into `bytes` instead of copying.
     * @returns The number of bytes read.
     */
    fromBytes (bytes: Uint8Array, zeroCopy?: boolean): number;
}
