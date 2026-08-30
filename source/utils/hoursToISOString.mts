import type HOURS_ENCODING from "../types/time/HOURS-ENCODING.mjs";

/**
 * @summary Convert a `HOURS-ENCODING` value to an ISO 8601 hour
 * @description
 * Produces strings such as `15` and `01`. Hours are always two digits.
 * @param {HOURS_ENCODING} value - The hours to stringify.
 * @returns {string} An ISO 8601 hour string.
 * @function
 */
export default
function hoursToISOString (value: HOURS_ENCODING): string {
    return value.hours.toString().padStart(2, "0");
}
