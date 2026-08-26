/**
 * @summary Validates if a string is a `GraphicString`.
 * @param s - The string to validate.
 * @returns True if the string is a `GraphicString`, false otherwise.
 * @function
 */
export function isGraphicString(s: string): boolean {
    return /^[ -~]*$/.test(s);
}

export default isGraphicString;
