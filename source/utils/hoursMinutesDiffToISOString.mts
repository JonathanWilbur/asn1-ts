import type HOURS_MINUTES_DIFF_ENCODING from "../types/time/HOURS-MINUTES-DIFF-ENCODING.mjs";
import hoursMinutesToISOString from "./hoursMinutesToISOString.mjs";
import minutesDiffToISOOffset from "./minutesDiffToISOOffset.mjs";

/**
 * @summary Convert a `HOURS-MINUTES-DIFF-ENCODING` value to an ISO 8601 hour-minute with offset
 * @description
 * Produces strings such as `15:58+05:00` and `01:02Z`. Hours and minutes are
 * always two digits.
 * @param {HOURS_MINUTES_DIFF_ENCODING} value - The time and UTC offset to stringify.
 * @returns {string} An ISO 8601 hour-minute string with a UTC offset.
 * @function
 */
export default
function hoursMinutesDiffToISOString (value: HOURS_MINUTES_DIFF_ENCODING): string {
    return `${hoursMinutesToISOString(value)}${minutesDiffToISOOffset(value.minutes_diff)}`;
}
