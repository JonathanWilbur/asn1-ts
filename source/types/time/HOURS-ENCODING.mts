import type { INTEGER } from "../../macros.mjs";
import datetimeComponentValidator from "../../validators/datetimeComponentValidator.mjs";
import hoursToISOString from "../../utils/hoursToISOString.mjs";
import { matchISO, parseISOTwoDigit } from "../../utils/parseISOTime.mjs";
import {
    HOURS_ENCODING_BRAND,
    isHOURS_ENCODINGLike,
    stampBrand,
} from "../../brands.mjs";

/**
 * Defined in ITU Recommendation X.696:2015, Section 29:
 *
 * `HOURS-ENCODING ::= SEQUENCE {
 *      hours   INTEGER (0..24)
 * }`
 */
export default
class HOURS_ENCODING {
    /**
     * `true` if `value` is an `HOURS-ENCODING` from this copy or another copy
     * of the package.
     *
     * @param value The value to test
     */
    static isClassOf (value: unknown): value is HOURS_ENCODING {
        return isHOURS_ENCODINGLike(value);
    }

    constructor (
        readonly hours: INTEGER,
    ) {
        datetimeComponentValidator("hour", 0, 24)("HOURS-ENCODING", hours);
    }

    /**
     * @summary Parse an ISO 8601 hour.
     * @description Example: `15`
     * @param {string} str - An ISO 8601 hour.
     * @returns {HOURS_ENCODING} The parsed hours.
     */
    public static fromISOString (str: string): HOURS_ENCODING {
        const match = matchISO(str, /^(\d{2})$/, "hour");
        return new HOURS_ENCODING(parseISOTwoDigit(match[1], "hour"));
    }

    /**
     * @summary Parse these hours from a string.
     * @description Equivalent to {@link fromISOString}. Example: `15`
     * @param {string} str - An ISO 8601 hour.
     * @returns {HOURS_ENCODING} The parsed hours.
     */
    public static fromString (str: string): HOURS_ENCODING {
        return HOURS_ENCODING.fromISOString(str);
    }

    /**
     * @summary Convert these hours to an ISO 8601 hour string.
     * @description Example: `15`
     * @returns {string} An ISO 8601 hour.
     */
    public toISOString (): string {
        return hoursToISOString(this);
    }

    /**
     * @summary Convert these hours to a string.
     * @description Equivalent to {@link toISOString}. Example: `15`
     * @returns {string} An ISO 8601 hour.
     */
    public toString (): string {
        return this.toISOString();
    }

    /**
     * @summary Convert these hours to a JSON value.
     * @description Equivalent to {@link toISOString}. Example: `15`
     * @returns {string} An ISO 8601 hour.
     */
    public toJSON (): string {
        return this.toISOString();
    }
}

stampBrand(HOURS_ENCODING.prototype, HOURS_ENCODING_BRAND);
