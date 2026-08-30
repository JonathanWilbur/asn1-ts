import type YEAR_MONTH_ENCODING from "../types/time/YEAR-MONTH-ENCODING.mjs";
import { padYear } from "./yearToISOString.mjs";

/**
 * @summary Convert a `YEAR-MONTH-ENCODING` value to an ISO 8601 year-month
 * @description
 * Produces strings such as `2020-03` and `0005-01`. The year is padded to at
 * least four digits. The month is always two digits.
 * @param {YEAR_MONTH_ENCODING} value - The year-month to stringify.
 * @returns {string} An ISO 8601 year-month string.
 * @function
 */
export default
function yearMonthToISOString (value: YEAR_MONTH_ENCODING): string {
    const month = value.month.toString().padStart(2, "0");
    return `${padYear(value.year)}-${month}`;
}
