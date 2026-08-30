import type TIME_OF_DAY_FRACTION_DIFF_ENCODING from "../types/time/TIME-OF-DAY-FRACTION-DIFF-ENCODING.mjs";
import timeOfDayFractionToISOString from "./timeOfDayFractionToISOString.mjs";
import minutesDiffToISOOffset from "./minutesDiffToISOOffset.mjs";

/**
 * @summary Convert a `TIME-OF-DAY-FRACTION-DIFF-ENCODING` value to an ISO 8601 time with offset
 * @description
 * Produces strings such as `15:58:23.123+05:00` and `01:02:03.5Z`. Hours,
 * minutes, and seconds are always two digits. The required `fractional-part`
 * is appended after a decimal point using its decimal digits.
 * @param {TIME_OF_DAY_FRACTION_DIFF_ENCODING} value - The time of day and UTC offset to stringify.
 * @returns {string} An ISO 8601 time-of-day string with a fractional second and UTC offset.
 * @function
 */
export default
function timeOfDayFractionDiffToISOString (value: TIME_OF_DAY_FRACTION_DIFF_ENCODING): string {
    return `${timeOfDayFractionToISOString(value)}${minutesDiffToISOOffset(value.minutes_diff)}`;
}
