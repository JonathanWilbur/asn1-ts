/**
 * Branded dot-delimited OBJECT IDENTIFIER string and its type guard.
 *
 * A valid dot-delimited OID consists of at least two decimal arcs separated
 * by single periods with no leading, trailing, or empty arcs and no leading
 * zeroes (except the arc `0` itself). The first arc must be `0`, `1`, or `2`,
 * and when the first arc is `0` or `1`, the second arc must be in the range
 * `0` to `39` inclusive.
 *
 * @module
 */

/**
 * Brand for {@link DotDelimitedOidString}.
 *
 * Declared but never emitted; it only exists at the type level so a plain
 * `string` is not assignable to {@link DotDelimitedOidString} without narrowing
 * via {@link isDotDelimitedOID} (or an explicit cast).
 */
declare const DOT_DELIMITED_OID_BRAND: unique symbol;

/**
 * A dot-delimited OBJECT IDENTIFIER string (e.g. `"1.2.840.113549"`).
 *
 * This is a branded string: a plain `string` is not assignable to it without
 * first passing the {@link isDotDelimitedOID} type guard (or an explicit
 * cast). For compile-time checking of literals, see
 * {@link IsValidDOTDelimitedOID}.
 */
export type DotDelimitedOidString = string & {
    readonly [DOT_DELIMITED_OID_BRAND]: typeof DOT_DELIMITED_OID_BRAND;
};

type NonZeroDigit = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type Digit = "0" | NonZeroDigit;

/**
 * Compile-time check that `S` is one or more decimal digits.
 */
export type IsDecimalDigits<S extends string> = S extends ""
    ? false
    : S extends `${Digit}${infer Rest}`
        ? Rest extends ""
            ? true
            : IsDecimalDigits<Rest>
        : false;

/**
 * Compile-time check for a single OID arc: a non-negative integer without
 * leading zeroes (`0` is the only arc that may start with `0`).
 */
export type IsOIDArc<S extends string> = S extends "0"
    ? true
    : S extends `${NonZeroDigit}${infer Rest}`
        ? Rest extends ""
            ? true
            : IsDecimalDigits<Rest>
        : false;

/**
 * Compile-time check for the second arc when the first arc is `0` or `1`:
 * an integer from `0` to `39` inclusive, without leading zeroes.
 */
export type IsSecondArcForFirstZeroOrOne<S extends string> = S extends Digit
    ? true
    : S extends `1${Digit}`
        ? true
        : S extends `2${Digit}`
            ? true
            : S extends `3${Digit}`
                ? true
                : false;

/**
 * Split a dotted string into its arcs at the type level.
 */
export type SplitOIDArcs<S extends string> = S extends `${infer Head}.${infer Tail}`
    ? [Head, ...SplitOIDArcs<Tail>]
    : [S];

/**
 * Compile-time check that every arc in `Arcs` is a valid {@link IsOIDArc}.
 */
export type AreValidOIDTailArcs<Arcs extends readonly string[]> = Arcs extends readonly []
    ? true
    : Arcs extends readonly [infer Head extends string, ...infer Tail extends string[]]
        ? IsOIDArc<Head> extends true
            ? AreValidOIDTailArcs<Tail>
            : false
        : false;

/**
 * Compile-time check that `S` is a valid dot-delimited OBJECT IDENTIFIER:
 * at least two arcs, first arc `0` / `1` / `2`, second arc `0`-`39` when the
 * first arc is `0` or `1`, no empty arcs, and no leading zeroes.
 *
 * Use it to constrain literals, e.g.
 * `function f<S extends string>(oid: S & (IsValidDOTDelimitedOID<S> extends true ? unknown : never))`.
 * Runtime input must still be narrowed with {@link isDotDelimitedOID}.
 */
export type IsValidDOTDelimitedOID<S extends string> = SplitOIDArcs<S> extends [
    infer First extends string,
    infer Second extends string,
    ...infer Rest extends string[],
]
    ? First extends "0" | "1"
        ? IsSecondArcForFirstZeroOrOne<Second> extends true
            ? AreValidOIDTailArcs<Rest>
            : false
        : First extends "2"
            ? IsOIDArc<Second> extends true
                ? AreValidOIDTailArcs<Rest>
                : false
            : false
    : false;

/**
 * @summary Determine whether a value is a valid dot-delimited OBJECT IDENTIFIER string
 * @description
 *
 * Returns `true` when `value` is a string of at least two decimal arcs
 * separated by single periods, with:
 *
 * - the first arc `0`, `1`, or `2`;
 * - the second arc in the range `0` to `39` when the first arc is `0` or `1`
 *   (any non-negative integer when the first arc is `2`);
 * - no empty arcs (hence no leading, trailing, or doubled periods); and
 * - no leading zeroes (except the arc `0` itself).
 *
 * Later arcs may be arbitrarily large: they are validated syntactically and
 * never converted to `number`, so arcs beyond `Number.MAX_SAFE_INTEGER`
 * are accepted.
 *
 * @param {string} value The value to test
 * @returns {boolean} `true` if `value` is a valid dot-delimited OID string
 * @function
 */
export function isDotDelimitedOID (value: string): value is DotDelimitedOidString {
    const len: number = value.length;
    if (len < 3) { // Shortest valid OID is "0.0" (two arcs).
        return false;
    }
    // Leading or trailing period means an empty arc.
    if (value.charCodeAt(0) === 46 || value.charCodeAt(len - 1) === 46) { // "."
        return false;
    }
    let arcIndex: number = 0;
    let arcLength: number = 0;
    let arcFirstCharCode: number = 0;
    let firstArc: number = -1;
    // The second arc only needs a range check when the first arc is 0 or 1,
    // in which case a valid value is at most two digits; anything longer is
    // necessarily > 39. Accumulation stops once past 39 to avoid overflow on
    // huge second arcs under first arc 2 (where any value is legal).
    let secondArcValue: number = 0;
    for (let i: number = 0; i < len; i++) {
        const c: number = value.charCodeAt(i);
        if (c === 46) { // "."
            // Empty arc (doubled period).
            if (arcLength === 0) {
                return false;
            }
            if (arcIndex === 0) {
                // First arc must be exactly "0", "1", or "2": a single char.
                if (arcLength !== 1) {
                    return false;
                }
                firstArc = arcFirstCharCode - 48;
                if (firstArc < 0 || firstArc > 2) {
                    return false;
                }
            } else if (arcIndex === 1) {
                if (firstArc < 2 && secondArcValue > 39) {
                    return false;
                }
            }
            arcIndex++;
            arcLength = 0;
            secondArcValue = 0;
            continue;
        }
        if (c < 48 || c > 57) { // not "0"-"9"
            return false;
        }
        if (arcLength === 0) {
            arcFirstCharCode = c;
        } else if (arcLength === 1 && arcFirstCharCode === 48) {
            // Leading zero: an arc longer than one char may not start with "0".
            return false;
        }
        arcLength++;
        if (arcIndex === 1 && secondArcValue <= 39) {
            secondArcValue = (secondArcValue * 10) + (c - 48);
        }
    }
    // The final arc has no terminating period, so handle it here.
    if (arcLength === 0) {
        return false;
    }
    if (arcIndex === 0) {
        // No period at all (a single arc).
        return false;
    }
    if (arcIndex === 1) {
        // Exactly two arcs: the loop validated the first arc at its period;
        // validate the second arc's range now.
        if (firstArc < 2 && secondArcValue > 39) {
            return false;
        }
    }
    return true;
}

export default isDotDelimitedOID;
