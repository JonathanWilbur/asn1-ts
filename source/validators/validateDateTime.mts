import validateDate from "./validateDate.mjs";
import validateTime from "./validateTime.mjs";

/**
 * @summary Validates an ASN.1 date-time value (year, month, day, hour, minute, second).
 * @description
 * This could be used for validating `DATE-TIME`, `GeneralizedTime`, and `UTCTime`.
 * 
 * @param {string} dataType - The ASN.1 type being validated (for error messages).
 * @param {number} year - The year value.
 * @param {number} month - The month value (0-based: 0=Jan, 1=Feb, ... 11=Dec).
 * @param {number} date - The day of the month (1-based).
 * @param {number} hours - The hour value (0-23).
 * @param {number} minutes - The minute value (0-59).
 * @param {number} seconds - The second value (0-59).
 * @returns {void}
 * @throws {ASN1Error} if the date or time is invalid.
 * @function
 */
export default function validateDateTime (
    dataType: string,
    year: number,
    month: number,
    date: number,
    hours: number,
    minutes: number,
    seconds: number,
): void {
    validateDate(dataType, year, month, date);
    validateTime(dataType, hours, minutes, seconds);
}
