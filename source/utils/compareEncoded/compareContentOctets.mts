import type ASN1Element from "../../asn1.mjs";
import { ASN1Construction } from "../../values.mjs";
import { Buffer } from "node:buffer";
import ContentOctetChunkCursor from "./ContentOctetChunkCursor.mjs";
import ContentOctetByteCursor from "./ContentOctetByteCursor.mjs";
import { foldAsciiByte, orderingSign } from "./internal.mjs";
import type { ContentOctetCompareOptions, EncodedCompareResult } from "./types.mjs";

/**
 * @summary Compare two content-octet chunk streams without joining fragments.
 * @internal
 */
function compareChunkStreams (
    a: ContentOctetChunkCursor,
    b: ContentOctetChunkCursor,
): EncodedCompareResult {
    let aChunk: Uint8Array | undefined;
    let bChunk: Uint8Array | undefined;
    let aOff: number = 0;
    let bOff: number = 0;
    let index: number = 0;

    const advanceA = (): void => {
        aChunk = a.nextChunk();
        aOff = 0;
    };
    const advanceB = (): void => {
        bChunk = b.nextChunk();
        bOff = 0;
    };

    advanceA();
    advanceB();

    while (true) {
        if (!aChunk && !bChunk) {
            return [ -1, 0 ];
        }
        if (!aChunk) {
            return [ index, -1 ];
        }
        if (!bChunk) {
            return [ index, 1 ];
        }

        const aBuf: Uint8Array = aChunk;
        const bBuf: Uint8Array = bChunk;

        // Chunks may have different lengths and offsets (different BER partitions).
        // Compare only the overlapping remainder of the two current chunks.
        const aRem: number = aBuf.length - aOff;
        const bRem: number = bBuf.length - bOff;
        const n: number = aRem < bRem ? aRem : bRem;
        // Bulk-compare the overlap; avoids a per-byte JS loop for the common equal case.
        const cmp: number = Buffer.compare(
            aBuf.subarray(aOff, aOff + n),
            bBuf.subarray(bOff, bOff + n),
        );
        if (cmp === 0) {
            // Overlap matched: advance logical index and both chunk offsets.
            index += n;
            aOff += n;
            bOff += n;
            // Exhausted a chunk? Pull the next fragment (undefined when that side ends).
            if (aOff >= aBuf.length) {
                advanceA();
            }
            if (bOff >= bBuf.length) {
                advanceB();
            }
            continue;
        }
        // Overlap differed: walk byte-by-byte to find the first mismatch index
        // and ordering sign (Buffer.compare only reports sign, not which offset).
        for (let j: number = 0; j < n; j++) {
            const av: number = aBuf[aOff + j];
            const bv: number = bBuf[bOff + j];
            if (av !== bv) {
                return [ index, orderingSign(av, bv) ];
            }
            index++;
        }
    }
}

/**
 * @summary Compare two content-octet streams byte-by-byte with ASCII case folding.
 * @internal
 */
function compareCaseFoldedOctetStreams (
    a: ContentOctetByteCursor,
    b: ContentOctetByteCursor,
): EncodedCompareResult {
    let i: number = 0;
    while (true) {
        const aByte: number | undefined = a.nextByte();
        const bByte: number | undefined = b.nextByte();
        if (aByte === undefined && bByte === undefined) {
            return [ -1, 0 ];
        }
        if (aByte === undefined) {
            return [ i, -1 ];
        }
        if (bByte === undefined) {
            return [ i, 1 ];
        }
        const af: number = foldAsciiByte(aByte);
        const bf: number = foldAsciiByte(bByte);
        if (af !== bf) {
            return [ i, orderingSign(af, bf) ];
        }
        i++;
    }
}

/**
 * @summary Compare primitive element content octets directly.
 * @internal
 */
function comparePrimitiveValues (
    a: Uint8Array,
    b: Uint8Array,
    asciiCaseFold: boolean,
): EncodedCompareResult {
    if (!asciiCaseFold) {
        if (a.length === b.length && Buffer.compare(a, b) === 0) {
            return [ -1, 0 ];
        }
        const shortest: number = a.length < b.length ? a.length : b.length;
        if (shortest > 0) {
            const prefixCmp: number = Buffer.compare(
                a.subarray(0, shortest),
                b.subarray(0, shortest),
            );
            if (prefixCmp === 0) {
                return [ shortest, a.length < b.length ? -1 : 1 ];
            }
        }
        for (let i: number = 0; i < shortest; i++) {
            if (a[i] !== b[i]) {
                return [ i, orderingSign(a[i], b[i]) ];
            }
        }
        return [ shortest, a.length < b.length ? -1 : 1 ];
    }
    const shortest: number = a.length < b.length ? a.length : b.length;
    for (let i: number = 0; i < shortest; i++) {
        const af: number = foldAsciiByte(a[i]);
        const bf: number = foldAsciiByte(b[i]);
        if (af !== bf) {
            return [ i, orderingSign(af, bf) ];
        }
    }
    if (a.length === b.length) {
        return [ -1, 0 ];
    }
    return [ shortest, a.length < b.length ? -1 : 1 ];
}

/**
 * @summary Compare two ASN.1 elements by raw content octets.
 * @description
 * Implements octet-string equality and ordering semantics. Constructed BER/CER
 * encodings are compared without deconstructing or joining fragments.
 *
 * When `asciiCaseFold` is true, ASCII `A`–`Z` are folded to lowercase before
 * comparison (caseIgnore / caseIgnoreOrdering semantics on single-byte strings).
 *
 * @param {ASN1Element} a - The first operand.
 * @param {ASN1Element} b - The second operand.
 * @param {ContentOctetCompareOptions} [options] - Comparison options.
 * @returns {EncodedCompareResult} Match index and ordering sign.
 * @function
 * @author Cursor Composer
 */
export function compareContentOctetsToElement (
    a: ASN1Element,
    b: ASN1Element,
    options: ContentOctetCompareOptions = {},
): EncodedCompareResult {
    const asciiCaseFold: boolean = options.asciiCaseFold ?? false;
    if (
        a.construction === ASN1Construction.primitive
        && b.construction === ASN1Construction.primitive
    ) {
        return comparePrimitiveValues(a.value, b.value, asciiCaseFold);
    }
    if (asciiCaseFold) {
        return compareCaseFoldedOctetStreams(
            new ContentOctetByteCursor(a),
            new ContentOctetByteCursor(b),
        );
    }
    return compareChunkStreams(
        new ContentOctetChunkCursor(a),
        new ContentOctetChunkCursor(b),
    );
}

/**
 * @summary Compare an ASN.1 element's content octets to a flat byte string.
 * @description
 * The `Uint8Array` operand is treated as one primitive content-octet sequence.
 * Useful for prefix matching against a known byte pattern.
 *
 * @param {ASN1Element} a - The ASN.1 operand.
 * @param {Uint8Array} bytes - The reference content octets.
 * @param {ContentOctetCompareOptions} [options] - Comparison options.
 * @returns {EncodedCompareResult} Match index and ordering sign.
 * @function
 * @author Cursor Composer
 */
export function compareContentOctetsToBytes (
    a: ASN1Element,
    bytes: Uint8Array,
    options: ContentOctetCompareOptions = {},
): EncodedCompareResult {
    const asciiCaseFold: boolean = options.asciiCaseFold ?? false;
    if (a.construction === ASN1Construction.primitive) {
        return comparePrimitiveValues(a.value, bytes, asciiCaseFold);
    }
    if (asciiCaseFold) {
        return compareCaseFoldedOctetStreams(
            new ContentOctetByteCursor(a),
            new ContentOctetByteCursor(bytes),
        );
    }
    return compareChunkStreams(
        new ContentOctetChunkCursor(a),
        new ContentOctetChunkCursor(bytes),
    );
}

/**
 * @summary Compare content octets of an ASN.1 element to another element or byte string.
 * @description
 * Dispatches once on the type of `b` so the hot comparison loop is monomorphic.
 *
 * @param {ASN1Element} a - The first operand.
 * @param {ASN1Element | Uint8Array} b - The second operand.
 * @param {ContentOctetCompareOptions} [options] - Comparison options.
 * @returns {EncodedCompareResult} Match index and ordering sign.
 * @function
 * @author Cursor Composer
 */
export default function compareContentOctets (
    a: ASN1Element,
    b: ASN1Element | Uint8Array,
    options: ContentOctetCompareOptions = {},
): EncodedCompareResult {
    if (b instanceof Uint8Array) {
        return compareContentOctetsToBytes(a, b, options);
    }
    return compareContentOctetsToElement(a, b, options);
}
