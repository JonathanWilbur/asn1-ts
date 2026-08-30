import type TIME_OF_DAY_ENCODING from "../types/time/TIME-OF-DAY-ENCODING.mjs";

/**
 * @summary Convert a `TIME-OF-DAY-ENCODING` value to an ISO 8601 time of day
 * @description
 * Produces strings such as `15:58:23` and `01:02:03`. Hours, minutes, and
 * seconds are always two digits.
 * @param {TIME_OF_DAY_ENCODING} value - The time of day to stringify.
 * @returns {string} An ISO 8601 time-of-day string.
 * @function
 */
export default
function timeOfDayToISOString (value: TIME_OF_DAY_ENCODING): string {
    const hours = value.hours.toString().padStart(2, "0");
    const minutes = value.minutes.toString().padStart(2, "0");
    const seconds = value.seconds.toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}
