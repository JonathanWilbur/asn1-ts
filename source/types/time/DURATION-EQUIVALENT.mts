import type {
    INTEGER,
    OPTIONAL,
} from "../../macros.mjs";
import * as errors from "../../errors.mjs";
import datetimeComponentValidator from "../../validators/datetimeComponentValidator.mjs";
import durationToISOString from "../../utils/durationToISOString.mjs";
import {
    DURATION_EQUIVALENT_BRAND,
    isDURATION_EQUIVALENTLike,
    stampBrand,
} from "../../brands.mjs";

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
    /**
     * @summary Determine whether a value is a `DURATION-EQUIVALENT`
     * @description
     *
     * Returns `true` if `value` is a `DURATION-EQUIVALENT` from this copy or
     * another copy of the package. `DURATION-EQUIVALENT` and
     * `DURATION-INTERVAL-ENCODING` share the same fields, so this check is
     * brand-only. Older copies without a brand are not recognized.
     *
     * @param {unknown} value The value to test
     * @return {boolean} `true` if `value` is a `DURATION-EQUIVALENT`
     * @static
     * @function
     * @author Cursor Grok 4.6
     */
    static isClassOf (value: unknown): value is DURATION_EQUIVALENT {
        return isDURATION_EQUIVALENTLike(value);
    }

    /**
     * @summary `Symbol.for` brand for this class
     * @description
     *
     * Interned in the realm-wide symbol registry so another copy of this
     * package observes the same symbol. Prefer {@link DURATION_EQUIVALENT.isClassOf} over
     * using this directly.
     *
     * @return {symbol} The interned brand
     * @static
     * @internal
     * @author Cursor Grok 4.6
     */
    static readonly brand: symbol = DURATION_EQUIVALENT_BRAND;

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

    public toISOString (): string {
        return durationToISOString(this);
    }

    public toJSON (): unknown {
        return {
            years: this.years,
            months: this.months,
            weeks: this.weeks,
            days: this.days,
            hours: this.hours,
            minutes: this.minutes,
            seconds: this.seconds,
            fractional_part: this.fractional_part
                ? {
                    number_of_digits: this.fractional_part.number_of_digits,
                    fractional_value: this.fractional_part.fractional_value,
                }
                : undefined,
        };
    }
}

stampBrand(DURATION_EQUIVALENT.prototype, DURATION_EQUIVALENT_BRAND);
