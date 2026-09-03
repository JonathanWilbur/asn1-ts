import type ASN1Element from "../../asn1.mjs";
import iterateContentOctetBytes from "./ContentOctetByteCursor.mjs";
import {
    foldAsciiByte,
    orderingSign,
    takeNext,
} from "./internal.mjs";
import type { DirectoryStringCompareOptions, EncodedCompareResult } from "./types.mjs";
import {
    A_EQUALS_B,
    A_GREATER_THAN_B,
    A_LESS_THAN_B,
} from "./types.mjs";

/**
 * @summary Map a single-byte directory string code point per X.520 (ASCII subset).
 * @description
 * Returns `null` when the byte is ignored, `0x20` for whitespace, or the byte
 * itself for other printable characters. Multi-byte UTF-8 is not supported.
 * @internal
 */
function mapDirectoryStringByte (byte: number): number | null {
    // CHARACTER TABULATION, LINE FEED, LINE TABULATION, FORM FEED, CARRIAGE RETURN
    if (byte === 0x09 || byte === 0x0A || byte === 0x0B || byte === 0x0C || byte === 0x0D) {
        return 0x20;
    }
    if (byte < 0x20 || byte === 0x7F) {
        return null;
    }
    return byte;
}

/**
 * Mutable pull-state for normalizing one side of a directory-string comparison.
 * 
 * This data structure is kind of confusing. Just look at the code in
 * {@link pullDirectoryChar} and you'll get it.
 * 
 * @internal
 */
interface DirectoryPullState {
    /**
     * Still before the first non-whitespace character.
     * While true, whitespace is skipped (leading trim).
     */
    leading: boolean;
    /**
     * Saw one or more whitespace bytes after a non-whitespace character.
     * The next non-whitespace character causes a single SPACE to be emitted first
     * (internal whitespace collapse); trailing whitespace never clears this and
     * is therefore ignored when the stream ends.
     */
    pendingWhitespace: boolean;
    /**
     * Non-whitespace character held back after emitting a collapsed SPACE.
     * Returned on the next pull so SPACE and the following character are two
     * separate logical units.
     */
    deferred: number | undefined;
}

function createDirectoryPullState (): DirectoryPullState {
    return {
        leading: true,
        pendingWhitespace: false,
        deferred: undefined,
    };
}

/**
 * @summary Pull the next normalized logical directory-string character.
 * @internal
 */
function pullDirectoryChar (
    bytes: Iterator<number>,
    state: DirectoryPullState,
    asciiCaseFold: boolean,
): number | undefined {
    if (state.deferred !== undefined) {
        const deferred: number = state.deferred;
        state.deferred = undefined;
        return deferred;
    }
    while (true) {
        const raw: number | undefined = takeNext(bytes);
        if (raw === undefined) {
            return undefined;
        }
        const mapped: number | null = mapDirectoryStringByte(raw);
        if (mapped === null) {
            continue;
        }
        if (mapped === 0x20) {
            if (state.leading) {
                continue;
            }
            state.pendingWhitespace = true;
            continue;
        }
        const normalized: number = asciiCaseFold ? foldAsciiByte(mapped) : mapped;
        if (state.pendingWhitespace) {
            state.pendingWhitespace = false;
            state.deferred = normalized;
            return 0x20;
        }
        state.leading = false;
        return normalized;
    }
}

/**
 * @summary Compare two directory-string byte iterators.
 * @internal
 */
function compareDirectoryStreams (
    a: Iterator<number>,
    b: Iterator<number>,
    asciiCaseFold: boolean,
): EncodedCompareResult {
    const aState: DirectoryPullState = createDirectoryPullState();
    const bState: DirectoryPullState = createDirectoryPullState();
    let matched: number = 0;
    while (true) {
        const aChar: number | undefined = pullDirectoryChar(a, aState, asciiCaseFold);
        const bChar: number | undefined = pullDirectoryChar(b, bState, asciiCaseFold);
        if (aChar === undefined && bChar === undefined) {
            return [ matched, A_EQUALS_B ];
        }
        if (aChar === undefined) {
            return [ matched, A_LESS_THAN_B ];
        }
        if (bChar === undefined) {
            return [ matched, A_GREATER_THAN_B ];
        }
        if (aChar !== bChar) {
            return [ matched, orderingSign(aChar, bChar) ];
        }
        matched++;
    }
}

/**
 * @summary Compare two ASN.1 elements using X.520 directory-string rules (ASCII).
 * @description
 * Implements a zero-allocation subset of X.520 directory string matching for
 * single-byte character strings such as `PrintableString` and `IA5String`.
 *
 * Leading and trailing whitespace are ignored. Internal whitespace runs collapse
 * to a single SPACE. TAB, LF, VT, FF, and CR map to SPACE. Other control
 * characters are ignored. Multi-byte UTF-8 characters are not supported.
 *
 * Returns `[matched, result]` where `matched` counts normalized logical
 * characters (not raw bytes) and `result` is {@link A_EQUALS_B} if equal, or
 * {@link A_LESS_THAN_B} / {@link A_GREATER_THAN_B} for `Array.prototype.sort`.
 *
 * @param {ASN1Element} a - The first operand.
 * @param {ASN1Element} b - The second operand.
 * @param {DirectoryStringCompareOptions} [options] - Comparison options.
 * @returns {EncodedCompareResult} Matched logical character count and result code.
 * @function
 * @author Cursor Composer
 */
export function compareDirectoryStringCharsToElement (
    a: ASN1Element,
    b: ASN1Element,
    options: DirectoryStringCompareOptions = {},
): EncodedCompareResult {
    const asciiCaseFold: boolean = options.asciiCaseFold ?? true;
    return compareDirectoryStreams(
        iterateContentOctetBytes(a, undefined, "PrintableString"),
        iterateContentOctetBytes(b, undefined, "PrintableString"),
        asciiCaseFold,
    );
}

/**
 * @summary Compare an ASN.1 element to flat bytes using directory-string rules.
 * @description
 * The `Uint8Array` operand is treated as one primitive byte sequence.
 *
 * @param {ASN1Element} a - The ASN.1 operand.
 * @param {Uint8Array} bytes - The reference bytes.
 * @param {DirectoryStringCompareOptions} [options] - Comparison options.
 * @returns {EncodedCompareResult} Matched logical character count and result code.
 * @function
 * @author Cursor Composer
 */
export function compareDirectoryStringCharsToBytes (
    a: ASN1Element,
    bytes: Uint8Array,
    options: DirectoryStringCompareOptions = {},
): EncodedCompareResult {
    const asciiCaseFold: boolean = options.asciiCaseFold ?? true;
    return compareDirectoryStreams(
        iterateContentOctetBytes(a, undefined, "PrintableString"),
        iterateContentOctetBytes(bytes),
        asciiCaseFold,
    );
}

/**
 * @summary Compare directory-string content of an element to another element or bytes.
 * @description
 * Dispatches once on the type of `b` so the hot comparison loop is monomorphic.
 *
 * @param {ASN1Element} a - The first operand.
 * @param {ASN1Element | Uint8Array} b - The second operand.
 * @param {DirectoryStringCompareOptions} [options] - Comparison options.
 * @returns {EncodedCompareResult} Matched logical character count and result code.
 * @function
 * @author Cursor Composer
 */
export default function compareDirectoryStringChars (
    a: ASN1Element,
    b: ASN1Element | Uint8Array,
    options: DirectoryStringCompareOptions = {},
): EncodedCompareResult {
    if (b instanceof Uint8Array) {
        return compareDirectoryStringCharsToBytes(a, b, options);
    }
    return compareDirectoryStringCharsToElement(a, b, options);
}
