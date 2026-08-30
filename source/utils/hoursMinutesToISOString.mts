import type HOURS_MINUTES_ENCODING from "../types/time/HOURS-MINUTES-ENCODING.mjs";

/**
 * @summary Convert a `HOURS-MINUTES-ENCODING` value to an ISO 8601 hour-minute
 * @description
 * Produces strings such as `15:58` and `01:02`. Hours and minutes are always
 * two digits.
 * @param {HOURS_MINUTES_ENCODING} value - The hours and minutes to stringify.
 * @returns {string} An ISO 8601 hour-minute string.
 * @function
 */
export default
function hoursMinutesToISOString (value: HOURS_MINUTES_ENCODING): string {
    const hours = value.hours.toString().padStart(2, "0");
    const minutes = value.minutes.toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}
