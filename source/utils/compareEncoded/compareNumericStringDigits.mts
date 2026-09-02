import type ASN1Element from "../../asn1.mjs";
import ContentOctetByteCursor from "./ContentOctetByteCursor.mjs";
import { orderingSign } from "./internal.mjs";
import type { EncodedCompareResult } from "./types.mjs";

const INVALID_DIGIT: unique symbol = Symbol("invalid digit");

type DigitPullResult = number | typeof INVALID_DIGIT | undefined;

/**
 * @summary Pull the next ASCII digit, skipping spaces.
 * @internal
 */
function pullDigit (cursor: ContentOctetByteCursor): DigitPullResult {
    while (true) {
        const byte: number | undefined = cursor.nextByte();
        if (byte === undefined) {
            return undefined;
        }
        if (byte === 0x20) {
            continue;
        }
        if (byte >= 0x30 && byte <= 0x39) {
            return byte;
        }
        return INVALID_DIGIT;
    }
}

/**
 * @summary Compare two numeric-string byte cursors.
 * @internal
 */
function compareNumericStreams (
    a: ContentOctetByteCursor,
    b: ContentOctetByteCursor,
): EncodedCompareResult {
    let matched: number = 0;
    while (true) {
        const aDigit: DigitPullResult = pullDigit(a);
        const bDigit: DigitPullResult = pullDigit(b);
        if (aDigit === INVALID_DIGIT || bDigit === INVALID_DIGIT) {
            return [ -2, 0 ];
        }
        if (aDigit === undefined && bDigit === undefined) {
            return [ -1, 0 ];
        }
        if (aDigit === undefined) {
            return [ matched, -1 ];
        }
        if (bDigit === undefined) {
            return [ matched, 1 ];
        }
        if (aDigit !== bDigit) {
            return [ matched, orderingSign(aDigit, bDigit) ];
        }
        matched++;
    }
}

/**
 * @summary Compare two ASN.1 elements as `NumericString` values.
 * @description
 * SPACE bytes (`0x20`) are ignored. Only ASCII digits are compared. Returns
 * `[-2, 0]` when either operand contains a byte that is not a digit or space.
 *
 * The first tuple element counts matched digits (not raw byte indices), which
 * supports prefix matching on digit sequences.
 *
 * @param {ASN1Element} a - The first operand.
 * @param {ASN1Element} b - The second operand.
 * @returns {EncodedCompareResult} Matched digit count and ordering sign.
 * @function
 * @author Cursor Composer
 */
export function compareNumericStringDigitsToElement (
    a: ASN1Element,
    b: ASN1Element,
): EncodedCompareResult {
    return compareNumericStreams(
        new ContentOctetByteCursor(a, undefined, "NumericString"),
        new ContentOctetByteCursor(b, undefined, "NumericString"),
    );
}

/**
 * @summary Compare an ASN.1 element to flat bytes as `NumericString`.
 * @description
 * The `Uint8Array` operand is treated as one primitive byte sequence.
 *
 * @param {ASN1Element} a - The ASN.1 operand.
 * @param {Uint8Array} bytes - The reference bytes.
 * @returns {EncodedCompareResult} Matched digit count and ordering sign.
 * @function
 * @author Cursor Composer
 */
export function compareNumericStringDigitsToBytes (
    a: ASN1Element,
    bytes: Uint8Array,
): EncodedCompareResult {
    return compareNumericStreams(
        new ContentOctetByteCursor(a, undefined, "NumericString"),
        new ContentOctetByteCursor(bytes),
    );
}

/**
 * @summary Compare numeric-string content of an element to another element or bytes.
 * @description
 * Dispatches once on the type of `b` so the hot comparison loop is monomorphic.
 *
 * @param {ASN1Element} a - The first operand.
 * @param {ASN1Element | Uint8Array} b - The second operand.
 * @returns {EncodedCompareResult} Matched digit count and ordering sign.
 * @function
 * @author Cursor Composer
 */
export default function compareNumericStringDigits (
    a: ASN1Element,
    b: ASN1Element | Uint8Array,
): EncodedCompareResult {
    if (b instanceof Uint8Array) {
        return compareNumericStringDigitsToBytes(a, b);
    }
    return compareNumericStringDigitsToElement(a, b);
}
