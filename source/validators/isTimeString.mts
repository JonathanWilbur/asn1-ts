declare const TIME_STRING_BRAND: unique symbol;

/**
 * A branded `GuaranteedTimeString`. A plain `string` is not assignable to it without
 * first passing the `isTimeString` type guard (or an explicit cast).
 */
export type GuaranteedTimeString = string & {
    readonly [TIME_STRING_BRAND]: typeof TIME_STRING_BRAND;
};

/**
 * @summary Checks if a string is a valid time string (`tstring`).
 * @description
 *
 * This function checks if a string is a valid `tstring` per
 * ITU-T Recommendation X.680 (2021), Section 12.17.
 *
 * @param value The string to check.
 * @returns True if the string is a valid time string, false otherwise.
 */
export function isTimeString(value: string): value is GuaranteedTimeString {
    return /^[0-9CDHMRPSTWYZ\+\-\.\,\/\:]+$/.test(value);
}

export default isTimeString;
