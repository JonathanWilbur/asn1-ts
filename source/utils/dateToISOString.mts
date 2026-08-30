import type DATE_ENCODING from "../types/time/DATE-ENCODING.mjs";
import type { INTEGER } from "../macros.mjs";

function padYear (year: INTEGER): string {
    const negative = year < 0;
    const abs = negative ? -year : year;
    return `${negative ? "-" : ""}${abs.toString().padStart(4, "0")}`;
}

/**
 * @summary Convert a `DATE-ENCODING` value to an ISO 8601 calendar date
 * @description
 * Produces strings such as `2020-03-07` and `0005-01-02`. The year is padded
 * to at least four digits. Month and day are always two digits.
 * @param {DATE_ENCODING} value - The date to stringify.
 * @returns {string} An ISO 8601 calendar date string.
 * @function
 */
export default
function dateToISOString (value: DATE_ENCODING): string {
    const month = value.month.toString().padStart(2, "0");
    const day = value.day.toString().padStart(2, "0");
    return `${padYear(value.year)}-${month}-${day}`;
}
