/**
 * @summary Validates if a string is a `PrintableString`.
 * @param s - The string to validate.
 * @returns True if the string is a `PrintableString`, false otherwise.
 * @function
 */
export function isPrintableString(s: string): boolean {
    return /^[A-Za-z0-9 '()+,-./:=?]*$/.test(s);
}

export default isPrintableString;
