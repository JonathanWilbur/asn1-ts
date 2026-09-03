import type ASN1Element from "../../asn1.mjs";
import { ASN1UniversalType } from "../../values.mjs";
import iterateContentOctetChunks from "./ContentOctetChunkCursor.mjs";

/**
 * @summary Iterate individual content octets across constructed BER/CER encodings.
 * @description
 * Walks {@link iterateContentOctetChunks} and yields bytes across chunk
 * boundaries without joining fragments. A `Uint8Array` operand is treated as a
 * single primitive content-octet sequence.
 *
 * @param {ASN1Element | Uint8Array} source - An ASN.1 element or flat bytes.
 * @param {number} [fragmentTagNumber=ASN1UniversalType.octetString] - Universal
 * tag number required on each constructed fragment when `source` is an element.
 * @param {string} [dataType="OCTET STRING"] - Type name used in error messages.
 * @yields {number} The next content octet.
 * @generator
 * @function
 * @author Cursor Composer
 */
export default function* iterateContentOctetBytes (
    source: ASN1Element | Uint8Array,
    fragmentTagNumber: number = ASN1UniversalType.octetString,
    dataType: string = "OCTET STRING",
): Generator<number, void, undefined> {
    if (source instanceof Uint8Array) {
        yield* source;
        return;
    }
    for (const chunk of iterateContentOctetChunks(source, fragmentTagNumber, dataType)) {
        yield* chunk;
    }
}
