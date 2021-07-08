import {
    INTEGER,
    OPTIONAL,
} from "../../macros";
import * as errors from "../../errors";
import datetimeComponentValidator from "../../validators/datetimeComponentValidator";

/**
 * Note that this is equivalent to `DURATION-INTERVAL-ENCODING` defined in
 * ITU X.696.
 *
 * `DURATION-EQUIVALENT ::= SEQUENCE {
 *     years               INTEGER (0..MAX) OPTIONAL,
 *     months              INTEGER (0..MAX) OPTIONAL,
 *     weeks               INTEGER (0..MAX) OPTIONAL,
 *     days                INTEGER (0..MAX) OPTIONAL,
 *     hours               INTEGER (0..MAX) OPTIONAL,
 *     minutes             INTEGER (0..MAX) OPTIONAL,
 *     seconds             INTEGER (0..MAX) OPTIONAL,
 *     fractional-part     SEQUENCE {
 *         number-of-digits INTEGER(1..MAX),
 *         fractional-value INTEGER(0..MAX) } OPTIONAL
 * }`
 */
export default
class DURATION_EQUIVALENT {
    constructor (
        readonly years: OPTIONAL<INTEGER>,
        readonly months: OPTIONAL<INTEGER>,
        readonly weeks: OPTIONAL<INTEGER>,
        readonly days: OPTIONAL<INTEGER>,
        readonly hours: OPTIONAL<INTEGER>,
        readonly minutes: OPTIONAL<INTEGER>,
        readonly seconds: OPTIONAL<INTEGER>,
        readonly fractional_part: OPTIONAL<{
            number_of_digits: INTEGER;
            fractional_value: INTEGER;
        }>,
    ) {
        if (
            typeof weeks !== "undefined"
            && (years || months || days || hours || minutes || seconds)
        ) {
            throw new errors.ASN1Error(
                "DURATION-EQUIVALENT may not combine week components and date-time components.",
            );
        }
        if (years) {
            datetimeComponentValidator("year", 0, Number.MAX_SAFE_INTEGER)("DURATION-EQUIVALENT", years);
        }
        if (months) {
            datetimeComponentValidator("month", 0, Number.MAX_SAFE_INTEGER)("DURATION-EQUIVALENT", months);
        }
        if (weeks) {
            datetimeComponentValidator("week", 0, Number.MAX_SAFE_INTEGER)("DURATION-EQUIVALENT", weeks);
        }
        if (days) {
            datetimeComponentValidator("day", 0, Number.MAX_SAFE_INTEGER)("DURATION-EQUIVALENT", days);
        }
        if (hours) {
            datetimeComponentValidator("hour", 0, Number.MAX_SAFE_INTEGER)("DURATION-EQUIVALENT", hours);
        }
        if (minutes) {
            datetimeComponentValidator("minute", 0, Number.MAX_SAFE_INTEGER)("DURATION-EQUIVALENT", minutes);
        }
        if (seconds) {
            datetimeComponentValidator("second", 0, Number.MAX_SAFE_INTEGER)("DURATION-EQUIVALENT", seconds);
        }
        if (fractional_part && !Number.isSafeInteger(fractional_part.fractional_value)) {
            throw new errors.ASN1Error("Malformed DURATION-EQUIVALENT fractional part.");
        }
    }

    public toString (): string {
        let ret: string = "DURATION { ";
        if (this.years !== undefined) {
            ret += `years ${this.years}`;
        }
        if (this.months !== undefined) {
            ret += `months ${this.months}`;
        }
        if (this.weeks !== undefined) {
            ret += `weeks ${this.weeks}`;
        }
        if (this.days !== undefined) {
            ret += `days ${this.days}`;
        }
        if (this.hours !== undefined) {
            ret += `hours ${this.hours}`;
        }
        if (this.minutes !== undefined) {
            ret += `minutes ${this.minutes}`;
        }
        if (this.seconds !== undefined) {
            ret += `seconds ${this.seconds}`;
        }
        ret += "}";
        return ret;
    }
}
