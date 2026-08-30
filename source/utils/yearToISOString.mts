import type YEAR_ENCODING from "../types/time/YEAR-ENCODING.mjs";
import type { INTEGER } from "../macros.mjs";

export
function padYear (year: INTEGER): string {
    const negative = year < 0;
    const abs = negative ? -year : year;
    return `${negative ? "-" : ""}${abs.toString().padStart(4, "0")}`;
}

/**
 * @summary Convert a `YEAR-ENCODING` value to an ISO 8601 year
 * @description
 * Produces strings such as `2020` and `0005`. The year is padded to at least
 * four digits.
 * @param {YEAR_ENCODING} value - The year to stringify.
 * @returns {string} An ISO 8601 year string.
 * @function
 */
export default
function yearToISOString (value: YEAR_ENCODING): string {
    return padYear(value.year);
}
