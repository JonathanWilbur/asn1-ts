/**
 * Branded ASN.1 binary string (`bstring`) and its type guard.
 *
 * A binary string is the ASN.1 value notation for `BIT STRING` values
 * (ITU-T X.680): a single quote, followed by zero or more `0` / `1`
 * characters, followed by a single quote and an uppercase `B`
 * (e.g. `'1001010'B`). The empty binary string `''B` denotes an empty
 * `BIT STRING` and is valid.
 *
 * @module
 */
import * as errors from "../errors.mjs";

/**
 * Brand for {@link ASN1BinaryString}.
 *
 * Declared but never emitted; it only exists at the type level so a plain
 * `string` is not assignable to {@link ASN1BinaryString} without narrowing
 * via {@link isASN1BinaryString} (or an explicit cast).
 */
declare const ASN1_BINARY_STRING_BRAND: unique symbol;

/**
 * An ASN.1 binary string in value notation (e.g. `'1001010'B`).
 *
 * This is a branded string: a plain `string` is not assignable to it without
 * first passing the {@link isASN1BinaryString} type guard (or an explicit
 * cast). For compile-time checking of literals, see
 * {@link IsValidASN1BinaryString}.
 */
export type ASN1BinaryString = string & {
    readonly [ASN1_BINARY_STRING_BRAND]: typeof ASN1_BINARY_STRING_BRAND;
};

/**
 * Compile-time check that `S` consists solely of `0` / `1` characters.
 * The empty string is valid (it denotes `''B`).
 */
export type IsBinaryDigits<S extends string> = S extends ""
    ? true
    : S extends `0${infer Rest}`
        ? IsBinaryDigits<Rest>
        : S extends `1${infer Rest}`
            ? IsBinaryDigits<Rest>
            : false;

/**
 * Compile-time check that `S` is a valid ASN.1 binary string:
 * a single quote, zero or more `0` / `1` characters, a single quote, and an
 * uppercase `B`.
 *
 * Use it to constrain literals, e.g.
 * `function f<S extends string>(bstr: S & (IsValidASN1BinaryString<S> extends true ? unknown : never))`.
 * Runtime input must still be narrowed with {@link isASN1BinaryString}.
 */
export type IsValidASN1BinaryString<S extends string> = S extends `'${infer Inner}'B`
    ? IsBinaryDigits<Inner>
    : false;

/**
 * @summary Determine whether a value is a valid ASN.1 binary string
 * @description
 *
 * Returns `true` when `value` is a string of the form `'...'B`, where `...`
 * is zero or more `0` / `1` characters. The trailing `B` must be uppercase.
 * The empty binary string `''B` (an empty `BIT STRING`) is valid.
 *
 * @param {string} value The value to test
 * @returns {boolean} `true` if `value` is a valid ASN.1 binary string
 * @function
 */
export function isASN1BinaryString (value: string): value is ASN1BinaryString {
    const len: number = value.length;
    if (len < 3) { // Shortest valid binary string is "''B".
        return false;
    }
    // Leading "'", closing "'", and uppercase "B".
    if (value.charCodeAt(0) !== 39) { // "'"
        return false;
    }
    if (value.charCodeAt(len - 2) !== 39) { // "'"
        return false;
    }
    if (value.charCodeAt(len - 1) !== 66) { // "B"
        return false;
    }
    for (let i: number = 1; i < len - 2; i++) {
        const c: number = value.charCodeAt(i);
        if (c !== 48 && c !== 49) { // not "0" or "1"
            return false;
        }
    }
    return true;
}

export default isASN1BinaryString;

/**
 * @summary Construct a branded ASN.1 binary string from a literal
 * @description
 *
 * Validates `value` at compile time (when it is a string literal) and at
 * runtime, returning it branded as an {@link ASN1BinaryString}. This is the
 * way to declare constants: a plain annotation cannot work, because a type
 * annotation cannot grant a brand — the literal has none — so write:
 *
 * ```ts
 * const val1 = toASN1BinaryString("'1001'B");
 * ```
 *
 * Passing an invalid literal is a compile-time error *and* throws at
 * runtime. If you already hold a `string` of unknown validity (not a
 * literal), narrow it with {@link isASN1BinaryString} instead; the guard is
 * the right tool for dynamic input.
 *
 * @param {string} value The binary-notation string to brand
 * @returns {ASN1BinaryString} `value`, branded
 * @throws {ASN1Error} If `value` is not a valid ASN.1 binary string
 * @function
 */
export function toASN1BinaryString<S extends string>(
    value: S & (IsValidASN1BinaryString<S> extends true ? unknown : never),
): ASN1BinaryString {
    if (!isASN1BinaryString(value)) {
        throw new errors.ASN1Error(`Invalid ASN.1 binary string: ${value}.`);
    }
    return value;
}
