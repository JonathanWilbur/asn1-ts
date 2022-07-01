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
    if (typeof TextEncoder !== "undefined") { // Browser JavaScript
        return (new TextDecoder(codec)).decode(bytes);
    } else if (typeof Buffer !== "undefined") { // NodeJS
        return (Buffer.from(bytes.buffer)).toString(codec as any);
    }
    throw new ASN1Error("Neither TextDecoder nor Buffer are defined to decode bytes into text.");
}
