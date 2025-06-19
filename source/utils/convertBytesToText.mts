import { ASN1Error } from "../errors.mjs";
import { Buffer } from "node:buffer";

/**
 * @summary Converts a byte array to a string using the specified codec, supporting both Node.js and browser environments.
 * @description
 * Used for decoding ASN.1 string types from their byte representation.
 *
 * @param {Uint8Array} bytes - The bytes to convert to text.
 * @param {string} [codec="utf-8"] - The codec to use (e.g., "utf-8").
 * @returns {string} The decoded string.
 * @function
 */
export default
function convertBytesToText (bytes: Uint8Array, codec: string = "utf-8"): string {
    if (typeof Buffer !== "undefined") { // NodeJS
        /**
         * If you call `Buffer.from(bytes.buffer)` (as seen below this `if`
         * statement), where `bytes` is of type `Buffer` (not `Uint8Array`), the
         * string will be the underlying memory block reserved for one (or more)
         * buffers, rather than what you intend!
         *
         * You can only use `Buffer.from(bytes.buffer)` if `bytes` is only a
         * `Uint8Array`.
         */
        if (bytes instanceof Buffer) {
            return bytes.toString(codec as any);
        }
        return (Buffer.from(bytes.buffer, bytes.byteOffset, bytes.length)).toString(codec as any);
    } else if (typeof TextEncoder !== "undefined") { // Browser JavaScript
        return (new TextDecoder(codec)).decode(bytes);
    }
    throw new ASN1Error("Neither TextDecoder nor Buffer are defined to decode bytes into text.");
}
