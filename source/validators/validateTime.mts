import * as errors from "../errors.mjs";

/**
 * @summary Validates an ASN.1 time value (hour, minute, second) for correctness and range.
 * @param {string} dataType - The ASN.1 type being validated (for error messages).
 * @param {number} hours - The hour value (0-23).
 * @param {number} minutes - The minute value (0-59).
 * @param {number} seconds - The second value (0-59).
 * @returns {void}
 * @throws {ASN1Error} if any of the time values are invalid or out of range.
 * @function
 */
export default function validateTime (
    dataType: string,
    hours: number,
    minutes: number,
    seconds: number,
): void {
    if (!Number.isSafeInteger(hours)) {
        throw new errors.ASN1Error(`Invalid hours in ${dataType}`);
    }
    if (!Number.isSafeInteger(minutes)) {
        throw new errors.ASN1Error(`Invalid minutes in ${dataType}`);
    }
    if (!Number.isSafeInteger(seconds) || (seconds < 0)) {
        throw new errors.ASN1Error(`Invalid seconds in ${dataType}`);
    }
    if (hours > 23) {
        throw new errors.ASN1Error(`Hours > 23 encountered in ${dataType}.`);
    }
    if (minutes > 59) {
        throw new errors.ASN1Error(`Minutes > 60 encountered in ${dataType}.`);
    }
    if (seconds > 59) {
        throw new errors.ASN1Error(`Seconds > 60 encountered in ${dataType}.`);
    }
}
