/**
 * Branded ASN.1 hexadecimal string (`hstring`) and its type guard.
 *
 * A hexadecimal string is the ASN.1 value notation for `OCTET STRING` values
 * (ITU-T X.680): a single quote, followed by an even number of hexadecimal
 * digits (each pair of digits denotes one octet), followed by a single quote
 * and an uppercase `H` (e.g. `'04DEFA'H`). Hexadecimal digits may be upper-
 * or lower-case. The empty hexadecimal string `''H` denotes an empty
 * `OCTET STRING` and is valid.
 *
 * @module
 */
import * as errors from "../errors.mjs";

/**
 * Brand for {@link ASN1HexString}.
 *
 * Declared but never emitted; it only exists at the type level so a plain
 * `string` is not assignable to {@link ASN1HexString} without narrowing
 * via {@link isASN1HexString} (or an explicit cast).
 */
declare const ASN1_HEX_STRING_BRAND: unique symbol;

/**
 * An ASN.1 hexadecimal string in value notation (e.g. `'04DEFA'H`).
 *
 * This is a branded string: a plain `string` is not assignable to it without
 * first passing the {@link isASN1HexString} type guard (or an explicit
 * cast). For compile-time checking of literals, see
 * {@link IsValidASN1HexString}.
 */
export type ASN1HexString = string & {
    readonly [ASN1_HEX_STRING_BRAND]: typeof ASN1_HEX_STRING_BRAND;
};

type HexDigit =
    | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
    | "a" | "b" | "c" | "d" | "e" | "f"
    | "A" | "B" | "C" | "D" | "E" | "F";

/**
 * Compile-time check that `S` consists of zero or more pairs of hexadecimal
 * digits. Pairing matters because each pair denotes one octet, so an odd
 * number of digits is invalid.
 */
export type IsHexDigitPairs<S extends string> = S extends ""
    ? true
    : S extends `${HexDigit}${HexDigit}${infer Rest}`
        ? IsHexDigitPairs<Rest>
        : false;

/**
 * Compile-time check that `S` is a valid ASN.1 hexadecimal string:
 * a single quote, an even number of hexadecimal digits, a single quote, and
 * an uppercase `H`.
 *
 * Use it to constrain literals, e.g.
 * `function f<S extends string>(hstr: S & (IsValidASN1HexString<S> extends true ? unknown : never))`.
 * Runtime input must still be narrowed with {@link isASN1HexString}.
 */
export type IsValidASN1HexString<S extends string> = S extends `'${infer Inner}'H`
    ? IsHexDigitPairs<Inner>
    : false;

/**
 * @summary Determine whether a value is a valid ASN.1 hexadecimal string
 * @description
 *
 * Returns `true` when `value` is a string of the form `'...'H`, where `...`
 * is an even number of hexadecimal digits (upper- or lower-case). Each pair
 * of digits denotes one octet, so an odd number of digits is invalid. The
 * trailing `H` must be uppercase. The empty hexadecimal string `''H` (an
 * empty `OCTET STRING`) is valid.
 *
 * @param {string} value The value to test
 * @returns {boolean} `true` if `value` is a valid ASN.1 hexadecimal string
 * @function
 */
export function isASN1HexString (value: string): value is ASN1HexString {
    if (typeof value !== "string") {
        return false;
    }
    const len: number = value.length;
    if (len < 3) { // Shortest valid hexadecimal string is "''H".
        return false;
    }
    // Leading "'", closing "'", and uppercase "H".
    if (value.charCodeAt(0) !== 39) { // "'"
        return false;
    }
    if (value.charCodeAt(len - 2) !== 39) { // "'"
        return false;
    }
    if (value.charCodeAt(len - 1) !== 72) { // "H"
        return false;
    }
    const innerLength: number = len - 3;
    // Each pair of hexadecimal digits denotes one octet.
    if ((innerLength % 2) !== 0) {
        return false;
    }
    for (let i: number = 1; i < len - 2; i++) {
        const c: number = value.charCodeAt(i);
        const isDigit: boolean = (c >= 48 && c <= 57); // "0"-"9"
        const isUpperHex: boolean = (c >= 65 && c <= 70); // "A"-"F"
        const isLowerHex: boolean = (c >= 97 && c <= 102); // "a"-"f"
        if (!isDigit && !isUpperHex && !isLowerHex) {
            return false;
        }
    }
    return true;
}

export default isASN1HexString;

/**
 * @summary Construct a branded ASN.1 hexadecimal string from a literal
 * @description
 *
 * Validates `value` at compile time (when it is a string literal) and at
 * runtime, returning it branded as an {@link ASN1HexString}. This is the
 * way to declare constants: a plain annotation cannot work, because a type
 * annotation cannot grant a brand — the literal has none — so write:
 *
 * ```ts
 * const val1 = toASN1HexString("'04DEFA'H");
 * ```
 *
 * Passing an invalid literal is a compile-time error *and* throws at
 * runtime. If you already hold a `string` of unknown validity (not a
 * literal), narrow it with {@link isASN1HexString} instead; the guard is
 * the right tool for dynamic input.
 *
 * @param {string} value The hex-notation string to brand
 * @returns {ASN1HexString} `value`, branded
 * @throws {ASN1Error} If `value` is not a valid ASN.1 hexadecimal string
 * @function
 */
export function toASN1HexString<S extends string>(
    value: S & (IsValidASN1HexString<S> extends true ? unknown : never),
): ASN1HexString {
    if (!isASN1HexString(value)) {
        throw new errors.ASN1Error(`Invalid ASN.1 hexadecimal string: ${value}.`);
    }
    return value;
}
