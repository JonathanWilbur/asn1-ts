import type ASN1Element from "../../asn1.mjs";
import { ASN1UniversalType } from "../../values.mjs";
import ContentOctetChunkCursor from "./ContentOctetChunkCursor.mjs";

/**
 * @summary Iterate individual content octets across constructed BER/CER encodings.
 * @description
 * Wraps {@link ContentOctetChunkCursor} and advances byte-by-byte across chunk
 * boundaries without joining fragments. A `Uint8Array` operand is treated as a
 * single primitive content-octet sequence.
 *
 * @class
 * @author Cursor Composer
 */
export default class ContentOctetByteCursor {
    private readonly chunkCursor: ContentOctetChunkCursor | undefined;
    private readonly flatBytes: Uint8Array | undefined;
    private currentChunk: Uint8Array | undefined;
    private chunkIndex: number = 0;
    private flatIndex: number = 0;

    /**
     * @param {ASN1Element | Uint8Array} source - An ASN.1 element or flat bytes.
     * @param {number} [fragmentTagNumber=ASN1UniversalType.octetString] - Universal
     * tag number required on each constructed fragment when `source` is an element.
     * @param {string} [dataType="OCTET STRING"] - Type name used in error messages.
     */
    public constructor (
        source: ASN1Element | Uint8Array,
        fragmentTagNumber: number = ASN1UniversalType.octetString,
        dataType: string = "OCTET STRING",
    ) {
        if (source instanceof Uint8Array) {
            this.flatBytes = source;
            this.chunkCursor = undefined;
        } else {
            this.flatBytes = undefined;
            this.chunkCursor = new ContentOctetChunkCursor(source, fragmentTagNumber, dataType);
        }
    }

    /**
     * @summary Return the next content octet, or `undefined` when exhausted.
     * @returns {number | undefined} The next byte value.
     */
    public nextByte (): number | undefined {
        if (this.flatBytes) {
            if (this.flatIndex >= this.flatBytes.length) {
                return undefined;
            }
            const byte: number = this.flatBytes[this.flatIndex];
            this.flatIndex++;
            return byte;
        }
        while (true) {
            if (this.currentChunk !== undefined && this.chunkIndex < this.currentChunk.length) {
                const byte: number = this.currentChunk[this.chunkIndex];
                this.chunkIndex++;
                return byte;
            }
            this.currentChunk = this.chunkCursor!.nextChunk();
            if (!this.currentChunk) {
                return undefined;
            }
            this.chunkIndex = 0;
        }
    }
}
