import type { INTEGER } from "../../macros.mjs";
import datetimeComponentValidator from "../../validators/datetimeComponentValidator.mjs";
import hoursMinutesDiffToISOString from "../../utils/hoursMinutesDiffToISOString.mjs";
import { matchISO, parseISOOffset, parseISOTwoDigit } from "../../utils/parseISOTime.mjs";
import {
    HOURS_MINUTES_DIFF_ENCODING_BRAND,
    isHOURS_MINUTES_DIFF_ENCODINGLike,
    stampBrand,
} from "../../brands.mjs";

/**
 * Defined in ITU Recommendation X.696:2015, Section 29:
 *
 * `HOURS-MINUTES-DIFF-ENCODING ::= SEQUENCE {
 *     hours           INTEGER (0..24),
 *     minutes         INTEGER (0..59),
 *     minutes-diff    INTEGER (-900..900)
 * }`
 */
export default
class HOURS_MINUTES_DIFF_ENCODING {
    /**
     * @summary Determine whether a value is an `HOURS-MINUTES-DIFF-ENCODING`
     * @description
     *
     * Returns `true` if `value` is an `HOURS-MINUTES-DIFF-ENCODING` from this copy or
     * another copy of the package. Consults a `Symbol.for` brand and, for
     * older copies without a brand, a structural check of the encoding fields.
     *
     * @param {unknown} value The value to test
     * @return {boolean} `true` if `value` is an `HOURS-MINUTES-DIFF-ENCODING`
     * @static
     * @function
     * @author Cursor Grok 4.6
     */
    static isClassOf (value: unknown): value is HOURS_MINUTES_DIFF_ENCODING {
        return isHOURS_MINUTES_DIFF_ENCODINGLike(value);
    }

    constructor (
        readonly hours: INTEGER,
        readonly minutes: INTEGER,
        readonly minutes_diff: INTEGER,
    ) {
        datetimeComponentValidator("hour", 0, 24)("HOURS-MINUTES-DIFF-ENCODING", hours);
        datetimeComponentValidator("minute", 0, 59)("HOURS-MINUTES-DIFF-ENCODING", minutes);
        datetimeComponentValidator("minute-diff", -900, 900)("HOURS-MINUTES-DIFF-ENCODING", minutes_diff);
    }

    /**
     * @summary Parse an ISO 8601 hour-minute with UTC offset.
     * @description Example: `15:58+05:00`
     * @param {string} str - An ISO 8601 hour-minute with a UTC offset.
     * @returns {HOURS_MINUTES_DIFF_ENCODING} The parsed hours, minutes, and offset.
     */
    public static fromISOString (str: string): HOURS_MINUTES_DIFF_ENCODING {
        const match = matchISO(str, /^(\d{2}):(\d{2})(Z|[+-]\d{2}:\d{2})$/, "hour-minute");
        return new HOURS_MINUTES_DIFF_ENCODING(
            parseISOTwoDigit(match[1], "hour"),
            parseISOTwoDigit(match[2], "minute"),
            parseISOOffset(match[3]),
        );
    }

    /**
     * @summary Parse these hours and minutes from a string.
     * @description Equivalent to {@link fromISOString}. Example: `15:58+05:00`
     * @param {string} str - An ISO 8601 hour-minute with a UTC offset.
     * @returns {HOURS_MINUTES_DIFF_ENCODING} The parsed hours, minutes, and offset.
     */
    public static fromString (str: string): HOURS_MINUTES_DIFF_ENCODING {
        return HOURS_MINUTES_DIFF_ENCODING.fromISOString(str);
    }

    /**
     * @summary Convert these hours and minutes to an ISO 8601 hour-minute string with UTC offset.
     * @description Example: `15:58+05:00`
     * @returns {string} An ISO 8601 hour-minute with a UTC offset.
     */
    public toISOString (): string {
        return hoursMinutesDiffToISOString(this);
    }

    /**
     * @summary Convert these hours and minutes to a string.
     * @description Equivalent to {@link toISOString}. Example: `15:58+05:00`
     * @returns {string} An ISO 8601 hour-minute with a UTC offset.
     */
    public toString (): string {
        return this.toISOString();
    }

    /**
     * @summary Convert these hours and minutes to a JSON value.
     * @description Equivalent to {@link toISOString}. Example: `15:58+05:00`
     * @returns {string} An ISO 8601 hour-minute with a UTC offset.
     */
    public toJSON (): string {
        return this.toISOString();
    }
}

stampBrand(HOURS_MINUTES_DIFF_ENCODING.prototype, HOURS_MINUTES_DIFF_ENCODING_BRAND);
