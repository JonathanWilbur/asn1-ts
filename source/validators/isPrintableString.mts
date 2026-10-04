declare const PRINTABLE_STRING_BRAND: unique symbol;

/**
 * A branded `GuaranteedPrintableString`. A plain `string` is not assignable to it without
 * first passing the `isPrintableString` type guard (or an explicit cast).
 */
export type GuaranteedPrintableString = string & {
    readonly [PRINTABLE_STRING_BRAND]: typeof PRINTABLE_STRING_BRAND;
};

/**
 * @summary Validates if a string is a `GuaranteedPrintableString`.
 * @param s - The string to validate.
 * @returns True if the string is a `GuaranteedPrintableString`, false otherwise.
 * @function
 */
export function isPrintableString(s: string): s is GuaranteedPrintableString {
    return /^[A-Za-z0-9 '()+,-./:=?]*$/.test(s);
}

export default isPrintableString;
