import { ASN1Error } from "../errors.mjs";
import { Buffer } from "node:buffer";
import type { SingleThreadUint8Array } from "../macros.mjs";

/**
 * @summary Converts a string to a byte array using the specified codec, supporting both Node.js and browser environments.
 * @description
 * Used for encoding ASN.1 string types to their byte representation.
 *
 * @param {string} text - The text to convert to bytes.
 * @param {string} [codec="utf-8"] - The codec to use (e.g., "utf-8").
 * @returns {Uint8Array<ArrayBuffer>} The encoded bytes.
 * @function
 */
export default
function convertTextToBytes (text: string, codec: string = "utf-8"): SingleThreadUint8Array {
    if (typeof TextEncoder !== "undefined") { // Browser JavaScript
        return (new TextEncoder()).encode(text);
    } else if (typeof Buffer !== "undefined") { // NodeJS
        return Buffer.from(text, codec as any);
    }
    throw new ASN1Error("Neither TextEncoder nor Buffer are defined to encode text into bytes.");
}

