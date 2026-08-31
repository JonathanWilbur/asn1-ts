import type { INTEGER } from "../../macros.mjs";
import datetimeComponentValidator from "../../validators/datetimeComponentValidator.mjs";
import yearMonthToISOString from "../../utils/yearMonthToISOString.mjs";
import { matchISO, parseISOTwoDigit, parseISOYear } from "../../utils/parseISOTime.mjs";
import {
    YEAR_MONTH_ENCODING_BRAND,
    isYEAR_MONTH_ENCODINGLike,
    stampBrand,
} from "../../brands.mjs";

/**
 * Defined in ITU Recommendation X.696:2015, Section 29:
 *
 * `YEAR-MONTH-ENCODING ::= SEQUENCE {
 *     year     INTEGER,
 *     month    INTEGER (1..12)
 * }`
 */
export default
class YEAR_MONTH_ENCODING {
    /**
     * @summary Determine whether a value is a `YEAR-MONTH-ENCODING`
     * @description
     *
     * Returns `true` if `value` is a `YEAR-MONTH-ENCODING` from this copy or
     * another copy of the package. Consults a `Symbol.for` brand and, for
     * older copies without a brand, a structural check of the encoding fields.
     *
     * @param {unknown} value The value to test
     * @return {boolean} `true` if `value` is a `YEAR-MONTH-ENCODING`
     * @static
     * @function
     * @author Cursor Grok 4.6
     */
    static isClassOf (value: unknown): value is YEAR_MONTH_ENCODING {
        return isYEAR_MONTH_ENCODINGLike(value);
    }

    constructor (
        readonly year: INTEGER,
        readonly month: INTEGER,
    ) {
        datetimeComponentValidator("month", 1, 12)("YEAR-MONTH-ENCODING", month);
    }

    /**
     * @summary Parse an ISO 8601 year-month.
     * @description Example: `2020-03`
     * @param {string} str - An ISO 8601 year-month.
     * @returns {YEAR_MONTH_ENCODING} The parsed year-month.
     */
    public static fromISOString (str: string): YEAR_MONTH_ENCODING {
        const match = matchISO(str, /^(-?\d{4,})-(\d{2})$/, "year-month");
        return new YEAR_MONTH_ENCODING(
            parseISOYear(match[1]),
            parseISOTwoDigit(match[2], "month"),
        );
    }

    /**
     * @summary Parse this year-month from a string.
     * @description Equivalent to {@link fromISOString}. Example: `2020-03`
     * @param {string} str - An ISO 8601 year-month.
     * @returns {YEAR_MONTH_ENCODING} The parsed year-month.
     */
    public static fromString (str: string): YEAR_MONTH_ENCODING {
        return YEAR_MONTH_ENCODING.fromISOString(str);
    }

    /**
     * @summary Convert this year-month to an ISO 8601 year-month string.
     * @description Example: `2020-03`
     * @returns {string} An ISO 8601 year-month.
     */
    public toISOString (): string {
        return yearMonthToISOString(this);
    }

    /**
     * @summary Convert this year-month to a string.
     * @description Equivalent to {@link toISOString}. Example: `2020-03`
     * @returns {string} An ISO 8601 year-month.
     */
    public toString (): string {
        return this.toISOString();
    }

    /**
     * @summary Convert this year-month to a JSON value.
     * @description Equivalent to {@link toISOString}. Example: `2020-03`
     * @returns {string} An ISO 8601 year-month.
     */
    public toJSON (): string {
        return this.toISOString();
    }
}

stampBrand(YEAR_MONTH_ENCODING.prototype, YEAR_MONTH_ENCODING_BRAND);
