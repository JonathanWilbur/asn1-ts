import type { INTEGER } from "../../macros.mjs";
import datetimeComponentValidator from "../../validators/datetimeComponentValidator.mjs";
import timeOfDayFractionDiffToISOString from "../../utils/timeOfDayFractionDiffToISOString.mjs";
import {
    matchISO,
    parseISONonNegativeInteger,
    parseISOOffset,
    parseISOTwoDigit,
} from "../../utils/parseISOTime.mjs";

/**
 * Defined in ITU Recommendation X.696:2015, Section 29:
 *
 * `TIME-OF-DAY-FRACTION-DIFF-ENCODING ::= SEQUENCE {
 *     hours           INTEGER (0..24),
 *     minutes         INTEGER (0..59),
 *     seconds         INTEGER (0..60),
 *     fractional-part INTEGER (0..MAX),
 *     minutes-diff    INTEGER (-900..900)
 * }`
 */
export default
class TIME_OF_DAY_FRACTION_DIFF_ENCODING {
    constructor (
        readonly hours: INTEGER,
        readonly minutes: INTEGER,
        readonly seconds: INTEGER,
        readonly fractional_part: INTEGER,
        readonly minutes_diff: INTEGER,
    ) {
        datetimeComponentValidator("hour", 0, 24)("TIME-OF-DAY-FRACTION-DIFF-ENCODING", hours);
        datetimeComponentValidator("minute", 0, 59)("TIME-OF-DAY-FRACTION-DIFF-ENCODING", minutes);
        datetimeComponentValidator("seconds", 0, 60)("TIME-OF-DAY-FRACTION-DIFF-ENCODING", seconds);
        datetimeComponentValidator("fractional-part", 0, Number.MAX_SAFE_INTEGER)(
            "TIME-OF-DAY-FRACTION-DIFF-ENCODING", fractional_part);
        datetimeComponentValidator("minute-diff", -900, 900)("TIME-OF-DAY-FRACTION-DIFF-ENCODING", minutes_diff);
    }

    /**
     * @summary Parse an ISO 8601 time of day with a fractional second and UTC offset.
     * @description Example: `15:58:23.123+05:00`
     * @param {string} str - An ISO 8601 time of day with a fractional second and UTC offset.
     * @returns {TIME_OF_DAY_FRACTION_DIFF_ENCODING} The parsed time of day and offset.
     */
    public static fromISOString (str: string): TIME_OF_DAY_FRACTION_DIFF_ENCODING {
        const match = matchISO(
            str,
            /^(\d{2}):(\d{2}):(\d{2})\.(\d+)(Z|[+-]\d{2}:\d{2})$/,
            "time of day",
        );
        return new TIME_OF_DAY_FRACTION_DIFF_ENCODING(
            parseISOTwoDigit(match[1], "hour"),
            parseISOTwoDigit(match[2], "minute"),
            parseISOTwoDigit(match[3], "second"),
            parseISONonNegativeInteger(match[4], "fractional-part"),
            parseISOOffset(match[5]),
        );
    }

    /**
     * @summary Parse this time of day from a string.
     * @description Equivalent to {@link fromISOString}. Example: `15:58:23.123+05:00`
     * @param {string} str - An ISO 8601 time of day with a fractional second and UTC offset.
     * @returns {TIME_OF_DAY_FRACTION_DIFF_ENCODING} The parsed time of day and offset.
     */
    public static fromString (str: string): TIME_OF_DAY_FRACTION_DIFF_ENCODING {
        return TIME_OF_DAY_FRACTION_DIFF_ENCODING.fromISOString(str);
    }

    /**
     * @summary Convert this time of day to an ISO 8601 time string with UTC offset.
     * @description Example: `15:58:23.123+05:00`
     * @returns {string} An ISO 8601 time of day with a fractional second and UTC offset.
     */
    public toISOString (): string {
        return timeOfDayFractionDiffToISOString(this);
    }

    /**
     * @summary Convert this time of day to a string.
     * @description Equivalent to {@link toISOString}. Example: `15:58:23.123+05:00`
     * @returns {string} An ISO 8601 time of day with a fractional second and UTC offset.
     */
    public toString (): string {
        return this.toISOString();
    }

    /**
     * @summary Convert this time of day to a JSON value.
     * @description Equivalent to {@link toISOString}. Example: `15:58:23.123+05:00`
     * @returns {string} An ISO 8601 time of day with a fractional second and UTC offset.
     */
    public toJSON (): string {
        return this.toISOString();
    }
}
