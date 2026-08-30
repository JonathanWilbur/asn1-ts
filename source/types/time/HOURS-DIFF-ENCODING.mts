import type { INTEGER } from "../../macros.mjs";
import datetimeComponentValidator from "../../validators/datetimeComponentValidator.mjs";
import hoursDiffToISOString from "../../utils/hoursDiffToISOString.mjs";
import { matchISO, parseISOOffset, parseISOTwoDigit } from "../../utils/parseISOTime.mjs";

/**
 * Defined in ITU Recommendation X.696:2015, Section 29:
 *
 * `HOURS-DIFF-ENCODING ::= SEQUENCE {
 *      hours           INTEGER (0..24),
 *      minutes-diff    INTEGER (-900..900)
 * }`
 */
export default
class HOURS_DIFF_ENCODING {
    constructor (
        readonly hours: INTEGER,
        readonly minutes_diff: INTEGER,
    ) {
        datetimeComponentValidator("hour", 0, 24)("HOURS-DIFF-ENCODING", hours);
        datetimeComponentValidator("minute-diff", -900, 900)("HOURS-DIFF-ENCODING", minutes_diff);
    }

    /**
     * @summary Parse an ISO 8601 hour with UTC offset.
     * @description Example: `15+05:00`
     * @param {string} str - An ISO 8601 hour with a UTC offset.
     * @returns {HOURS_DIFF_ENCODING} The parsed hours and offset.
     */
    public static fromISOString (str: string): HOURS_DIFF_ENCODING {
        const match = matchISO(str, /^(\d{2})(Z|[+-]\d{2}:\d{2})$/, "hour");
        return new HOURS_DIFF_ENCODING(
            parseISOTwoDigit(match[1], "hour"),
            parseISOOffset(match[2]),
        );
    }

    /**
     * @summary Parse these hours from a string.
     * @description Equivalent to {@link fromISOString}. Example: `15+05:00`
     * @param {string} str - An ISO 8601 hour with a UTC offset.
     * @returns {HOURS_DIFF_ENCODING} The parsed hours and offset.
     */
    public static fromString (str: string): HOURS_DIFF_ENCODING {
        return HOURS_DIFF_ENCODING.fromISOString(str);
    }

    /**
     * @summary Convert these hours to an ISO 8601 hour string with UTC offset.
     * @description Example: `15+05:00`
     * @returns {string} An ISO 8601 hour with a UTC offset.
     */
    public toISOString (): string {
        return hoursDiffToISOString(this);
    }

    /**
     * @summary Convert these hours to a string.
     * @description Equivalent to {@link toISOString}. Example: `15+05:00`
     * @returns {string} An ISO 8601 hour with a UTC offset.
     */
    public toString (): string {
        return this.toISOString();
    }

    /**
     * @summary Convert these hours to a JSON value.
     * @description Equivalent to {@link toISOString}. Example: `15+05:00`
     * @returns {string} An ISO 8601 hour with a UTC offset.
     */
    public toJSON (): string {
        return this.toISOString();
    }
}
