/**
 * @summary Result of comparing two encoded ASN.1 content values.
 * @description
 * The first element is the comparison index:
 *
 * - `-1` when the values are fully equal under the comparison rule.
 * - `-2` when the comparison is undefined (invalid `NumericString` content).
 * - A non-negative integer when the values differ or one is a prefix of the
 *   other: the number of content octets, logical directory-string characters,
 *   or digits that matched before the difference.
 *
 * The second element is an ordering sign for use with `Array.prototype.sort()`:
 * `-1` if the first operand sorts before the second, `1` if after, `0` if equal.
 *
 * @typedef {readonly [number, -1 | 0 | 1]} EncodedCompareResult
 * @author Cursor Composer
 */
export type EncodedCompareResult = readonly [index: number, ordering: -1 | 0 | 1];

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
