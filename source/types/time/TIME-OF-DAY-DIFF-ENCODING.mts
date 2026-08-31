import type { INTEGER } from "../../macros.mjs";
import datetimeComponentValidator from "../../validators/datetimeComponentValidator.mjs";
import timeOfDayDiffToISOString from "../../utils/timeOfDayDiffToISOString.mjs";
import { matchISO, parseISOOffset, parseISOTwoDigit } from "../../utils/parseISOTime.mjs";
import {
    TIME_OF_DAY_DIFF_ENCODING_BRAND,
    isTIME_OF_DAY_DIFF_ENCODINGLike,
    stampBrand,
} from "../../brands.mjs";

/**
 * Defined in ITU Recommendation X.696:2015, Section 29:
 *
 * `TIME-OF-DAY-DIFF-ENCODING ::= SEQUENCE {
 *     hours           INTEGER (0..24),
 *     minutes         INTEGER (0..59),
 *     seconds         INTEGER (0..60),
 *     minutes-diff    INTEGER (-900..900)
 * }`
 */
export default
class TIME_OF_DAY_DIFF_ENCODING {
    /**
     * `true` if `value` is a `TIME-OF-DAY-DIFF-ENCODING` from this copy or
     * another copy of the package.
     *
     * @param value The value to test
     */
    static isClassOf (value: unknown): value is TIME_OF_DAY_DIFF_ENCODING {
        return isTIME_OF_DAY_DIFF_ENCODINGLike(value);
    }

    constructor (
        readonly hours: INTEGER,
        readonly minutes: INTEGER,
        readonly seconds: INTEGER,
        readonly minutes_diff: INTEGER,
    ) {
        datetimeComponentValidator("hour", 0, 24)("TIME-OF-DAY-DIFF-ENCODING", hours);
        datetimeComponentValidator("minute", 0, 59)("TIME-OF-DAY-DIFF-ENCODING", minutes);
        datetimeComponentValidator("seconds", 0, 60)("TIME-OF-DAY-DIFF-ENCODING", seconds);
        datetimeComponentValidator("minute-diff", -900, 900)("TIME-OF-DAY-DIFF-ENCODING", minutes_diff);
    }

    /**
     * @summary Parse an ISO 8601 time of day with UTC offset.
     * @description Example: `15:58:23+05:00`
     * @param {string} str - An ISO 8601 time of day with a UTC offset.
     * @returns {TIME_OF_DAY_DIFF_ENCODING} The parsed time of day and offset.
     */
    public static fromISOString (str: string): TIME_OF_DAY_DIFF_ENCODING {
        const match = matchISO(str, /^(\d{2}):(\d{2}):(\d{2})(Z|[+-]\d{2}:\d{2})$/, "time of day");
        return new TIME_OF_DAY_DIFF_ENCODING(
            parseISOTwoDigit(match[1], "hour"),
            parseISOTwoDigit(match[2], "minute"),
            parseISOTwoDigit(match[3], "second"),
            parseISOOffset(match[4]),
        );
    }

    /**
     * @summary Parse this time of day from a string.
     * @description Equivalent to {@link fromISOString}. Example: `15:58:23+05:00`
     * @param {string} str - An ISO 8601 time of day with a UTC offset.
     * @returns {TIME_OF_DAY_DIFF_ENCODING} The parsed time of day and offset.
     */
    public static fromString (str: string): TIME_OF_DAY_DIFF_ENCODING {
        return TIME_OF_DAY_DIFF_ENCODING.fromISOString(str);
    }

    /**
     * @summary Convert this time of day to an ISO 8601 time string with UTC offset.
     * @description Example: `15:58:23+05:00`
     * @returns {string} An ISO 8601 time of day with a UTC offset.
     */
    public toISOString (): string {
        return timeOfDayDiffToISOString(this);
    }

    /**
     * @summary Convert this time of day to a string.
     * @description Equivalent to {@link toISOString}. Example: `15:58:23+05:00`
     * @returns {string} An ISO 8601 time of day with a UTC offset.
     */
    public toString (): string {
        return this.toISOString();
    }

    /**
     * @summary Convert this time of day to a JSON value.
     * @description Equivalent to {@link toISOString}. Example: `15:58:23+05:00`
     * @returns {string} An ISO 8601 time of day with a UTC offset.
     */
    public toJSON (): string {
        return this.toISOString();
    }
}

stampBrand(TIME_OF_DAY_DIFF_ENCODING.prototype, TIME_OF_DAY_DIFF_ENCODING_BRAND);
