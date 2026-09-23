import {
    ASN1Construction,
    ASN1Element,
    ASN1UniversalType,
    type BIT_STRING,
} from "../index.mjs";
import { Buffer } from "node:buffer";

/**
 * Clear the unused bits in the final content octet. BER allows those bits
 * to be either 0 or 1 without changing the BIT STRING value.
 * The first content octet is the unused-bits count (0..7).
 */
function maskedLastByte (contents: Uint8Array): number {
    const last = contents[contents.length - 1];
    const unused = contents[0];
    if (unused === 0 || unused > 7) {
        return last;
    }
    return last & (0xFF << unused);
}

function compareEncodedBitStrings (a: ASN1Element, b: ASN1Element): boolean {
    // FYI: I, Jonathan Wilbur, checked that .deconstruct() is suitable for BIT STRING.
    const av = (a.construction === ASN1Construction.constructed)
        ? a.deconstruct("BIT STRING", ASN1UniversalType.bitString)
        : a.value;
    const bv = (b.construction === ASN1Construction.constructed)
        ? b.deconstruct("BIT STRING", ASN1UniversalType.bitString)
        : b.value;
    if (av.length !== bv.length) {
        return false;
    }
    if (av.length <= 1) {
        return (av.length === 0) || (av[0] === bv[0]);
    }
    if (Buffer.compare(av.subarray(0, -1), bv.subarray(0, -1)) !== 0) {
        return false;
    }
    return maskedLastByte(av) === maskedLastByte(bv);
}

function compareDecodedBitStrings (a: BIT_STRING, b: BIT_STRING): boolean {
    // `Buffer.from(bits.buffer)` copies the whole backing store, which can
    // extend past the bit view (non-zero `byteOffset` or a longer buffer).
    return Buffer.compare(
        Buffer.from(a.buffer, a.byteOffset, a.byteLength),
        Buffer.from(b.buffer, b.byteOffset, b.byteLength),
    ) === 0;
}

/**
 * @summary Compare two `BIT STRING` values
 * @description
 * Either argument may be an encoded element or a decoded `BIT_STRING`
 * (`Uint8ClampedArray`, one entry per bit). When either argument is a
 * decoded bit string, the other is converted to a `BIT_STRING` and the
 * two bit views are compared. Trailing zero bits remain significant.
 *
 * When both arguments are encoded elements, constructed values are
 * deconstructed, then every octet but the last is compared directly and
 * the last octet is compared after its unused bits are masked off.
 * @param a One value
 * @param b The other
 * @returns {boolean} `true` if they match; `false` otherwise
 * @function
 */
export
function compareBitStrings (
    a: ASN1Element | BIT_STRING,
    b: ASN1Element | BIT_STRING,
): boolean {
    if ((a instanceof Uint8ClampedArray) || (b instanceof Uint8ClampedArray)) {
        return compareDecodedBitStrings(
            (a instanceof Uint8ClampedArray) ? a : a.bitString,
            (b instanceof Uint8ClampedArray) ? b : b.bitString,
        );
    }
    if (ASN1Element.isElement(a) && ASN1Element.isElement(b)) {
        return compareEncodedBitStrings(a, b);
    }
    return false;
}

export default compareBitStrings;
