import type { INTEGER } from "../../macros.mjs";
import datetimeComponentValidator from "../../validators/datetimeComponentValidator.mjs";
import timeOfDayFractionToISOString from "../../utils/timeOfDayFractionToISOString.mjs";
import { matchISO, parseISONonNegativeInteger, parseISOTwoDigit } from "../../utils/parseISOTime.mjs";

/**
 * Defined in ITU Recommendation X.696:2015, Section 29:
 *
 * `TIME-OF-DAY-FRACTION-ENCODING ::= SEQUENCE {
 *     hours           INTEGER (0..24),
 *     minutes         INTEGER (0..59),
 *     seconds         INTEGER (0..60),
 *     fractional-part INTEGER (0..MAX)
 * }`
 */
export default
class TIME_OF_DAY_FRACTION_ENCODING {
    constructor (
        readonly hours: INTEGER,
        readonly minutes: INTEGER,
        readonly seconds: INTEGER,
        readonly fractional_part: INTEGER,
    ) {
        datetimeComponentValidator("hour", 0, 24)("TIME-OF-DAY-FRACTION-ENCODING", hours);
        datetimeComponentValidator("minute", 0, 59)("TIME-OF-DAY-FRACTION-ENCODING", minutes);
        datetimeComponentValidator("seconds", 0, 60)("TIME-OF-DAY-FRACTION-ENCODING", seconds);
        datetimeComponentValidator("fractional-part", 0, Number.MAX_SAFE_INTEGER)(
            "TIME-OF-DAY-FRACTION-ENCODING", fractional_part);
    }

    /**
     * @summary Parse an ISO 8601 time of day with a fractional second.
     * @description Example: `15:58:23.123`
     * @param {string} str - An ISO 8601 time of day with a fractional second.
     * @returns {TIME_OF_DAY_FRACTION_ENCODING} The parsed time of day.
     */
    public static fromISOString (str: string): TIME_OF_DAY_FRACTION_ENCODING {
        const match = matchISO(str, /^(\d{2}):(\d{2}):(\d{2})\.(\d+)$/, "time of day");
        return new TIME_OF_DAY_FRACTION_ENCODING(
            parseISOTwoDigit(match[1], "hour"),
            parseISOTwoDigit(match[2], "minute"),
            parseISOTwoDigit(match[3], "second"),
            parseISONonNegativeInteger(match[4], "fractional-part"),
        );
    }

    /**
     * @summary Parse this time of day from a string.
     * @description Equivalent to {@link fromISOString}. Example: `15:58:23.123`
     * @param {string} str - An ISO 8601 time of day with a fractional second.
     * @returns {TIME_OF_DAY_FRACTION_ENCODING} The parsed time of day.
     */
    public static fromString (str: string): TIME_OF_DAY_FRACTION_ENCODING {
        return TIME_OF_DAY_FRACTION_ENCODING.fromISOString(str);
    }

    /**
     * @summary Convert this time of day to an ISO 8601 time string.
     * @description Example: `15:58:23.123`
     * @returns {string} An ISO 8601 time of day with a fractional second.
     */
    public toISOString (): string {
        return timeOfDayFractionToISOString(this);
    }

    /**
     * @summary Convert this time of day to a string.
     * @description Equivalent to {@link toISOString}. Example: `15:58:23.123`
     * @returns {string} An ISO 8601 time of day with a fractional second.
     */
    public toString (): string {
        return this.toISOString();
    }

    /**
     * @summary Convert this time of day to a JSON value.
     * @description Equivalent to {@link toISOString}. Example: `15:58:23.123`
     * @returns {string} An ISO 8601 time of day with a fractional second.
     */
    public toJSON (): string {
        return this.toISOString();
    }
}
