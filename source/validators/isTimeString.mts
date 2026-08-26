
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
export function isTimeString(value: string): boolean {
    return /^[0-9CDHMRPSTWYZ\+\-\.\,\/\:]+$/.test(value);
}

export default isTimeString;
