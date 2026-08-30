import type TIME_OF_DAY_FRACTION_ENCODING from "../types/time/TIME-OF-DAY-FRACTION-ENCODING.mjs";

/**
 * @summary Convert a `TIME-OF-DAY-FRACTION-ENCODING` value to an ISO 8601 time
 * @description
 * Produces strings such as `15:58:23.123` and `01:02:03.5`. Hours, minutes,
 * and seconds are always two digits. The required `fractional-part` is
 * appended after a decimal point using its decimal digits (precision is not
 * stored in this encoding).
 * @param {TIME_OF_DAY_FRACTION_ENCODING} value - The time of day to stringify.
 * @returns {string} An ISO 8601 time-of-day string with a fractional second.
 * @function
 */
export default
function timeOfDayFractionToISOString (value: TIME_OF_DAY_FRACTION_ENCODING): string {
    const hours = value.hours.toString().padStart(2, "0");
    const minutes = value.minutes.toString().padStart(2, "0");
    const seconds = value.seconds.toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}.${value.fractional_part}`;
}
