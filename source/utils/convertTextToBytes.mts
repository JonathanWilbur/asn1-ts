import { ASN1Error } from "../errors.mjs";
import { Buffer } from "node:buffer";

/**
 * A function to support encoding text to bytes both in web browsers and in
 * NodeJS.
 *
 * Converting text to any other bytes other than UTF-8 is no longer supported.
 * This only applies when TextEncoder is used. Buffer can still decode
 * different codecs.
 * See: [The MDN page on TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder).
 *
 * @param text {string} The text to convert to bytes.
 * @param codec {string} The string identifier of the codec to use, such as "utf-8".
 * @returns {Uint8Array} The converted bytes.
 */
export default
function convertTextToBytes (text: string, codec: string = "utf-8"): Uint8Array {
    if (typeof TextEncoder !== "undefined") { // Browser JavaScript
        return (new TextEncoder()).encode(text);
    } else if (typeof Buffer !== "undefined") { // NodeJS
        return Buffer.from(text, codec as any);
    }
    throw new ASN1Error("Neither TextEncoder nor Buffer are defined to encode text into bytes.");
}

