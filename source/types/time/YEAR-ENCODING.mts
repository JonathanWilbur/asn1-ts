import type { INTEGER } from "../../macros.mjs";
import yearToISOString from "../../utils/yearToISOString.mjs";
import { matchISO, parseISOYear } from "../../utils/parseISOTime.mjs";
import {
    YEAR_ENCODING_BRAND,
    isYEAR_ENCODINGLike,
    stampBrand,
} from "../../brands.mjs";

/**
 * Defined in ITU Recommendation X.696:2015, Section 29:
 *
 * `YEAR-ENCODING ::= SEQUENCE {
 *     year     INTEGER
 * }`
 */
export default
class YEAR_ENCODING {
    /**
     * `true` if `value` is a `YEAR-ENCODING` from this copy or another copy of
     * the package.
     *
     * @param value The value to test
     */
    static isClassOf (value: unknown): value is YEAR_ENCODING {
        return isYEAR_ENCODINGLike(value);
    }

    constructor (
        readonly year: INTEGER,
    ) {}

    /**
     * @summary Parse an ISO 8601 year.
     * @description Example: `2020`
     * @param {string} str - An ISO 8601 year.
     * @returns {YEAR_ENCODING} The parsed year.
     */
    public static fromISOString (str: string): YEAR_ENCODING {
        const match = matchISO(str, /^(-?\d{4,})$/, "year");
        return new YEAR_ENCODING(parseISOYear(match[1]));
    }

    /**
     * @summary Parse this year from a string.
     * @description Equivalent to {@link fromISOString}. Example: `2020`
     * @param {string} str - An ISO 8601 year.
     * @returns {YEAR_ENCODING} The parsed year.
     */
    public static fromString (str: string): YEAR_ENCODING {
        return YEAR_ENCODING.fromISOString(str);
    }

    /**
     * @summary Convert this year to an ISO 8601 year string.
     * @description Example: `2020`
     * @returns {string} An ISO 8601 year.
     */
    public toISOString (): string {
        return yearToISOString(this);
    }

    /**
     * @summary Convert this year to a string.
     * @description Equivalent to {@link toISOString}. Example: `2020`
     * @returns {string} An ISO 8601 year.
     */
    public toString (): string {
        return this.toISOString();
    }

    /**
     * @summary Convert this year to a JSON value.
     * @description Equivalent to {@link toISOString}. Example: `2020`
     * @returns {string} An ISO 8601 year.
     */
    public toJSON (): string {
        return this.toISOString();
    }
}

stampBrand(YEAR_ENCODING.prototype, YEAR_ENCODING_BRAND);
