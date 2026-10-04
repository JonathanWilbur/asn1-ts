declare const NUMERIC_STRING_BRAND: unique symbol;

/**
 * A branded `GuaranteedNumericString`. A plain `string` is not assignable to it without
 * first passing the `isNumericString` type guard (or an explicit cast).
 */
export type GuaranteedNumericString = string & {
    readonly [NUMERIC_STRING_BRAND]: typeof NUMERIC_STRING_BRAND;
};

/**
 * @summary Validates if a string is a `GuaranteedNumericString`
 * @param s - The string to validate.
 * @returns True if the string is a `GuaranteedNumericString`, false otherwise.
 * @function
 */
export function isNumericString(s: string): s is GuaranteedNumericString {
    return /^[0-9 ]*$/.test(s);
}

export default isNumericString;
