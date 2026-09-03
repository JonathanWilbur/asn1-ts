/**
 * @summary First operand sorts before the second (`Array.prototype.sort`).
 * @constant
 * @author Cursor Composer
 */
export const A_LESS_THAN_B = -1 as const;

/**
 * @summary Operands are equal under the comparison rule.
 * @constant
 * @author Cursor Composer
 */
export const A_EQUALS_B = 0 as const;

/**
 * @summary First operand sorts after the second (`Array.prototype.sort`).
 * @constant
 * @author Cursor Composer
 */
export const A_GREATER_THAN_B = 1 as const;

/**
 * @summary First operand (`a`) is not a valid `NumericString`.
 * @constant
 * @author Cursor Composer
 */
export const A_INVALID = -2 as const;

/**
 * @summary Second operand (`b`) is not a valid `NumericString`.
 * @constant
 * @author Cursor Composer
 */
export const B_INVALID = 2 as const;

/**
 * @summary Sort / equality / validity code from an encoded comparison.
 * @description
 * Suitable for `Array.prototype.sort` predicates ({@link A_LESS_THAN_B},
 * {@link A_EQUALS_B}, {@link A_GREATER_THAN_B}). Any negative value orders the
 * first operand before the second; any positive value orders it after.
 *
 * For {@link compareNumericStringDigits} only:
 *
 * - {@link A_INVALID} — the first operand (`a`) contains a byte that is not an
 *   ASCII digit or SPACE.
 * - {@link B_INVALID} — the second operand (`b`) contains such a byte.
 *
 * If both operands are invalid at the same pull step, {@link A_INVALID} is
 * returned. Other compare functions never return `±2`.
 *
 * @typedef {-2 | -1 | 0 | 1 | 2} EncodedCompareResultCode
 * @author Cursor Composer
 */
export type EncodedCompareResultCode =
    | typeof A_INVALID
    | typeof A_LESS_THAN_B
    | typeof A_EQUALS_B
    | typeof A_GREATER_THAN_B
    | typeof B_INVALID;

/**
 * @summary Result of comparing two encoded ASN.1 content values.
 * @description
 * The first element (`matched`) is the number of content octets, logical
 * directory-string characters, or ASCII digits that matched under the
 * comparison rule. Units are rule-specific: raw content octets for
 * {@link compareContentOctets}, normalized logical characters (after whitespace
 * trim/collapse) for {@link compareDirectoryStringChars}, and digits only
 * (spaces ignored) for {@link compareNumericStringDigits}. Callers must not
 * assume `matched` equals a raw `value.length`.
 *
 * When the values are fully equal, `matched` is the full length in those units
 * and `result` is {@link A_EQUALS_B}. When they differ or one is a prefix of
 * the other, `matched` is the common prefix length and `result` is
 * {@link A_LESS_THAN_B} or {@link A_GREATER_THAN_B}. When a `NumericString`
 * comparison encounters an invalid byte, `result` is {@link A_INVALID} or
 * {@link B_INVALID}, and `matched` is the number of digits read before that
 * error.
 *
 * @typedef {readonly [number, EncodedCompareResultCode]} EncodedCompareResult
 * @author Cursor Composer
 */
export type EncodedCompareResult = readonly [
    matched: number,
    result: EncodedCompareResultCode,
];

/**
 * @summary Options for raw content-octet comparison.
 * @typedef {object} ContentOctetCompareOptions
 * @property {boolean} [asciiCaseFold=false] When true, ASCII uppercase letters
 * are folded to lowercase before comparison.
 * @author Cursor Composer
 */
export interface ContentOctetCompareOptions {
    asciiCaseFold?: boolean;
}

/**
 * @summary Options for X.520 directory-string character comparison.
 * @typedef {object} DirectoryStringCompareOptions
 * @property {boolean} [asciiCaseFold=true] When true, ASCII uppercase letters
 * are folded to lowercase before comparison.
 * @author Cursor Composer
 */
export interface DirectoryStringCompareOptions {
    asciiCaseFold?: boolean;
}
