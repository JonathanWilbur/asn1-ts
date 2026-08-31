import type { INTEGER } from "../../macros.mjs";
import datetimeComponentValidator from "../../validators/datetimeComponentValidator.mjs";
import dateToISOString from "../../utils/dateToISOString.mjs";
import { matchISO, parseISOTwoDigit, parseISOYear } from "../../utils/parseISOTime.mjs";
import {
    DATE_ENCODING_BRAND,
    isDATE_ENCODINGLike,
    stampBrand,
} from "../../brands.mjs";

/**
 * Defined in ITU Recommendation X.696:2015, Section 29:
 *
 * `DATE-ENCODING ::= SEQUENCE {
 *     year     INTEGER,
 *     month    INTEGER (1..12),
 *     day      INTEGER (1..31)
 * }`
 */
export default
class DATE_ENCODING {
    /**
     * @summary Determine whether a value is a `DATE-ENCODING`
     * @description
     *
     * Returns `true` if `value` is a `DATE-ENCODING` from this copy or
     * another copy of the package. Consults a `Symbol.for` brand and, for
     * older copies without a brand, a structural check of the encoding fields.
     *
     * @param {unknown} value The value to test
     * @return {boolean} `true` if `value` is a `DATE-ENCODING`
     * @static
     * @function
     * @author Cursor Grok 4.6
     */
    static isClassOf (value: unknown): value is DATE_ENCODING {
        return isDATE_ENCODINGLike(value);
    }

    constructor (
        readonly year: INTEGER,
        readonly month: INTEGER,
        readonly day: INTEGER,
    ) {
        datetimeComponentValidator("month", 1, 12)("DATE-ENCODING", month);
        datetimeComponentValidator("day", 1, 31)("DATE-ENCODING", day);
    }

    /**
     * @summary Parse an ISO 8601 calendar date.
     * @description Example: `2020-03-07`
     * @param {string} str - An ISO 8601 calendar date.
     * @returns {DATE_ENCODING} The parsed date.
     */
    public static fromISOString (str: string): DATE_ENCODING {
        const match = matchISO(str, /^(-?\d{4,})-(\d{2})-(\d{2})$/, "date");
        return new DATE_ENCODING(
            parseISOYear(match[1]),
            parseISOTwoDigit(match[2], "month"),
            parseISOTwoDigit(match[3], "day"),
        );
    }

    /**
     * @summary Parse this date from a string.
     * @description Equivalent to {@link fromISOString}. Example: `2020-03-07`
     * @param {string} str - An ISO 8601 calendar date.
     * @returns {DATE_ENCODING} The parsed date.
     */
    public static fromString (str: string): DATE_ENCODING {
        return DATE_ENCODING.fromISOString(str);
    }

    /**
     * @summary Convert this date to an ISO 8601 calendar date string.
     * @description Example: `2020-03-07`
     * @returns {string} An ISO 8601 calendar date.
     */
    public toISOString (): string {
        return dateToISOString(this);
    }

    /**
     * @summary Convert this date to a string.
     * @description Equivalent to {@link toISOString}. Example: `2020-03-07`
     * @returns {string} An ISO 8601 calendar date.
     */
    public toString (): string {
        return this.toISOString();
    }

    /**
     * @summary Convert this date to a JSON value.
     * @description Equivalent to {@link toISOString}. Example: `2020-03-07`
     * @returns {string} An ISO 8601 calendar date.
     */
    public toJSON (): string {
        return this.toISOString();
    }
}

stampBrand(DATE_ENCODING.prototype, DATE_ENCODING_BRAND);
