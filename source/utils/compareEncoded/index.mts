/**
 * @module compareEncoded
 * @description
 * Zero-allocation utilities for comparing BER/CER encoded string and OCTET STRING
 * content without deconstructing constructed encodings.
 */

export type {
    ContentOctetCompareOptions,
    DirectoryStringCompareOptions,
    EncodedCompareResult,
} from "./types.mjs";
export { default as ContentOctetChunkCursor } from "./ContentOctetChunkCursor.mjs";
export { default as ContentOctetByteCursor } from "./ContentOctetByteCursor.mjs";
export {
    default as compareContentOctets,
    compareContentOctetsToElement,
    compareContentOctetsToBytes,
} from "./compareContentOctets.mjs";
export {
    default as compareDirectoryStringChars,
    compareDirectoryStringCharsToElement,
    compareDirectoryStringCharsToBytes,
} from "./compareDirectoryStringChars.mjs";
export {
    default as compareNumericStringDigits,
    compareNumericStringDigitsToElement,
    compareNumericStringDigitsToBytes,
} from "./compareNumericStringDigits.mjs";
