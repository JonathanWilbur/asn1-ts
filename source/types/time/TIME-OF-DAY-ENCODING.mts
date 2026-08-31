import type { INTEGER } from "../../macros.mjs";
import datetimeComponentValidator from "../../validators/datetimeComponentValidator.mjs";
import timeOfDayToISOString from "../../utils/timeOfDayToISOString.mjs";
import { matchISO, parseISOTwoDigit } from "../../utils/parseISOTime.mjs";
import {
    TIME_OF_DAY_ENCODING_BRAND,
    isTIME_OF_DAY_ENCODINGLike,
    stampBrand,
} from "../../brands.mjs";

/**
 * Defined in ITU Recommendation X.696:2015, Section 29:
 *
 * `TIME-OF-DAY-ENCODING ::= SEQUENCE {
 *     hours       INTEGER (0..24),
 *     minutes     INTEGER (0..59),
 *     seconds     INTEGER (0..60)
 * }`
 */
export default
class TIME_OF_DAY_ENCODING {
    /**
     * `true` if `value` is a `TIME-OF-DAY-ENCODING` from this copy or another
     * copy of the package.
     *
     * @param value The value to test
     */
    static isClassOf (value: unknown): value is TIME_OF_DAY_ENCODING {
        return isTIME_OF_DAY_ENCODINGLike(value);
    }

    constructor (
        readonly hours: INTEGER,
        readonly minutes: INTEGER,
        readonly seconds: INTEGER,
    ) {
        datetimeComponentValidator("hour", 0, 24)("TIME-OF-DAY-ENCODING", hours);
        datetimeComponentValidator("minute", 0, 59)("TIME-OF-DAY-ENCODING", minutes);
        datetimeComponentValidator("seconds", 0, 60)("TIME-OF-DAY-ENCODING", seconds);
    }

    /**
     * @summary Parse an ISO 8601 time of day.
     * @description Example: `15:58:23`
     * @param {string} str - An ISO 8601 time of day.
     * @returns {TIME_OF_DAY_ENCODING} The parsed time of day.
     */
    public static fromISOString (str: string): TIME_OF_DAY_ENCODING {
        const match = matchISO(str, /^(\d{2}):(\d{2}):(\d{2})$/, "time of day");
        return new TIME_OF_DAY_ENCODING(
            parseISOTwoDigit(match[1], "hour"),
            parseISOTwoDigit(match[2], "minute"),
            parseISOTwoDigit(match[3], "second"),
        );
    }

    /**
     * @summary Parse this time of day from a string.
     * @description Equivalent to {@link fromISOString}. Example: `15:58:23`
     * @param {string} str - An ISO 8601 time of day.
     * @returns {TIME_OF_DAY_ENCODING} The parsed time of day.
     */
    public static fromString (str: string): TIME_OF_DAY_ENCODING {
        return TIME_OF_DAY_ENCODING.fromISOString(str);
    }

    /**
     * @summary Convert this time of day to an ISO 8601 time string.
     * @description Example: `15:58:23`
     * @returns {string} An ISO 8601 time of day.
     */
    public toISOString (): string {
        return timeOfDayToISOString(this);
    }

    /**
     * @summary Convert this time of day to a string.
     * @description Equivalent to {@link toISOString}. Example: `15:58:23`
     * @returns {string} An ISO 8601 time of day.
     */
    public toString (): string {
        return this.toISOString();
    }

    /**
     * @summary Convert this time of day to a JSON value.
     * @description Equivalent to {@link toISOString}. Example: `15:58:23`
     * @returns {string} An ISO 8601 time of day.
     */
    public toJSON (): string {
        return this.toISOString();
    }
}

stampBrand(TIME_OF_DAY_ENCODING.prototype, TIME_OF_DAY_ENCODING_BRAND);
