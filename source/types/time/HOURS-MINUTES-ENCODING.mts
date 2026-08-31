import type { INTEGER } from "../../macros.mjs";
import datetimeComponentValidator from "../../validators/datetimeComponentValidator.mjs";
import hoursMinutesToISOString from "../../utils/hoursMinutesToISOString.mjs";
import { matchISO, parseISOTwoDigit } from "../../utils/parseISOTime.mjs";
import {
    HOURS_MINUTES_ENCODING_BRAND,
    isHOURS_MINUTES_ENCODINGLike,
    stampBrand,
} from "../../brands.mjs";

/**
 * Defined in ITU Recommendation X.696:2015, Section 29:
 *
 * `HOURS-MINUTES-ENCODING ::= SEQUENCE {
 *     hours    INTEGER (0..24),
 *     minutes  INTEGER (0..59)
 * }`
 */
export default
class HOURS_MINUTES_ENCODING {
    /**
     * @summary Determine whether a value is an `HOURS-MINUTES-ENCODING`
     * @description
     *
     * Returns `true` if `value` is an `HOURS-MINUTES-ENCODING` from this copy or
     * another copy of the package. Consults a `Symbol.for` brand and, for
     * older copies without a brand, a structural check of the encoding fields.
     *
     * @param {unknown} value The value to test
     * @return {boolean} `true` if `value` is an `HOURS-MINUTES-ENCODING`
     * @static
     * @function
     * @author Cursor Grok 4.6
     */
    static isClassOf (value: unknown): value is HOURS_MINUTES_ENCODING {
        return isHOURS_MINUTES_ENCODINGLike(value);
    }

    /**
     * @summary `Symbol.for` brand for this class
     * @description
     *
     * Interned in the realm-wide symbol registry so another copy of this
     * package observes the same symbol. Prefer {@link HOURS_MINUTES_ENCODING.isClassOf} over
     * using this directly.
     *
     * @return {symbol} The interned brand
     * @static
     * @internal
     * @author Cursor Grok 4.6
     */
    static readonly brand: symbol = HOURS_MINUTES_ENCODING_BRAND;

    constructor (
        readonly hours: INTEGER,
        readonly minutes: INTEGER,
    ) {
        datetimeComponentValidator("hour", 0, 24)("HOURS-MINUTES-ENCODING", hours);
        datetimeComponentValidator("minute", 0, 59)("HOURS-MINUTES-ENCODING", minutes);
    }

    /**
     * @summary Parse an ISO 8601 hour-minute.
     * @description Example: `15:58`
     * @param {string} str - An ISO 8601 hour-minute.
     * @returns {HOURS_MINUTES_ENCODING} The parsed hours and minutes.
     */
    public static fromISOString (str: string): HOURS_MINUTES_ENCODING {
        const match = matchISO(str, /^(\d{2}):(\d{2})$/, "hour-minute");
        return new HOURS_MINUTES_ENCODING(
            parseISOTwoDigit(match[1], "hour"),
            parseISOTwoDigit(match[2], "minute"),
        );
    }

    /**
     * @summary Parse these hours and minutes from a string.
     * @description Equivalent to {@link fromISOString}. Example: `15:58`
     * @param {string} str - An ISO 8601 hour-minute.
     * @returns {HOURS_MINUTES_ENCODING} The parsed hours and minutes.
     */
    public static fromString (str: string): HOURS_MINUTES_ENCODING {
        return HOURS_MINUTES_ENCODING.fromISOString(str);
    }

    /**
     * @summary Convert these hours and minutes to an ISO 8601 hour-minute string.
     * @description Example: `15:58`
     * @returns {string} An ISO 8601 hour-minute.
     */
    public toISOString (): string {
        return hoursMinutesToISOString(this);
    }

    /**
     * @summary Convert these hours and minutes to a string.
     * @description Equivalent to {@link toISOString}. Example: `15:58`
     * @returns {string} An ISO 8601 hour-minute.
     */
    public toString (): string {
        return this.toISOString();
    }

    /**
     * @summary Convert these hours and minutes to a JSON value.
     * @description Equivalent to {@link toISOString}. Example: `15:58`
     * @returns {string} An ISO 8601 hour-minute.
     */
    public toJSON (): string {
        return this.toISOString();
    }
}

stampBrand(HOURS_MINUTES_ENCODING.prototype, HOURS_MINUTES_ENCODING_BRAND);
