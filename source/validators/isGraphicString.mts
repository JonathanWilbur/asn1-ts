declare const GRAPHIC_STRING_BRAND: unique symbol;

/**
 * A branded `GuaranteedGraphicString`. A plain `string` is not assignable to it without
 * first passing the `isGraphicString` type guard (or an explicit cast).
 */
export type GuaranteedGraphicString = string & {
    readonly [GRAPHIC_STRING_BRAND]: typeof GRAPHIC_STRING_BRAND;
};

/**
 * @summary Validates if a string is a `GuaranteedGraphicString`.
 * @param s - The string to validate.
 * @returns True if the string is a `GuaranteedGraphicString`, false otherwise.
 * @function
 */
export function isGraphicString(s: string): s is GuaranteedGraphicString {
    return /^[ -~]*$/.test(s);
}

export default isGraphicString;
