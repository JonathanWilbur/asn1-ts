import type TIME_OF_DAY_DIFF_ENCODING from "../types/time/TIME-OF-DAY-DIFF-ENCODING.mjs";
import timeOfDayToISOString from "./timeOfDayToISOString.mjs";
import minutesDiffToISOOffset from "./minutesDiffToISOOffset.mjs";

/**
 * @summary Convert a `TIME-OF-DAY-DIFF-ENCODING` value to an ISO 8601 time with offset
 * @description
 * Produces strings such as `15:58:23+05:00` and `01:02:03Z`. Hours, minutes,
 * and seconds are always two digits.
 * @param {TIME_OF_DAY_DIFF_ENCODING} value - The time of day and UTC offset to stringify.
 * @returns {string} An ISO 8601 time-of-day string with a UTC offset.
 * @function
 */
export default
function timeOfDayDiffToISOString (value: TIME_OF_DAY_DIFF_ENCODING): string {
    return `${timeOfDayToISOString(value)}${minutesDiffToISOOffset(value.minutes_diff)}`;
}
