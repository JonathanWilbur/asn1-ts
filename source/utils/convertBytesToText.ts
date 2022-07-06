import { ASN1Error } from "../errors";

/**
 * A function to support decoding bytes to text both in web browsers and in
 * NodeJS.
 *
 * @param bytes {Uint8Array} The bytes to convert to text.
 * @param codec {string} The string identifier of the codec to use, such as "utf-8".
 * @returns {string} The converted string.
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
        return (Buffer.from(bytes.buffer)).toString(codec as any);
    } else if (typeof TextEncoder !== "undefined") { // Browser JavaScript
        return (new TextDecoder(codec)).decode(bytes);
    }
    throw new ASN1Error("Neither TextDecoder nor Buffer are defined to decode bytes into text.");
}
