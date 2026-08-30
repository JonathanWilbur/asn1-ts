import type HOURS_DIFF_ENCODING from "../types/time/HOURS-DIFF-ENCODING.mjs";
import hoursToISOString from "./hoursToISOString.mjs";
import minutesDiffToISOOffset from "./minutesDiffToISOOffset.mjs";

/**
 * @summary Convert a `HOURS-DIFF-ENCODING` value to an ISO 8601 hour with offset
 * @description
 * Produces strings such as `15+05:00` and `01Z`. Hours are always two digits.
 * @param {HOURS_DIFF_ENCODING} value - The hours and UTC offset to stringify.
 * @returns {string} An ISO 8601 hour string with a UTC offset.
 * @function
 */
export default
function hoursDiffToISOString (value: HOURS_DIFF_ENCODING): string {
    return `${hoursToISOString(value)}${minutesDiffToISOOffset(value.minutes_diff)}`;
}
