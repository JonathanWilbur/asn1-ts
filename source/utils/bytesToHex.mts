import { Buffer } from "node:buffer";

/**
 * @summary Hex-encode a byte view, two characters per octet.
 * @description
 * `Buffer.from(bytes.buffer).toString("hex")` would dump the entire backing
 * `ArrayBuffer`, including Node.js Buffer-pool contents and neighbouring
 * slices. Always pass `byteOffset` and `byteLength` (or call `.toString("hex")`
 * on an existing `Buffer`, which already encodes only that view).
 *
 * @param {Uint8Array} bytes - The bytes to encode. Only this view is encoded.
 * @returns {string} Lower-case hexadecimal, two characters per byte.
 * @function
 */
export default
function bytesToHex (bytes: Uint8Array): string {
    if (bytes instanceof Buffer) {
        return bytes.toString("hex");
    }
    return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("hex");
}
