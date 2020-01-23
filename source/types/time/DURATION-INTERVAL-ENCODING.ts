import {
    INTEGER,
    OPTIONAL,
} from "../../macros";
import * as errors from "../../errors";
import datetimeComponentValidator from "../../validators/datetimeComponentValidator";

/**
 * Defined in ITU Recommendation X.696:2015, Section 29:
 *
 * `DURATION-INTERVAL-ENCODING ::= SEQUENCE {
 *     years           INTEGER (0..MAX) OPTIONAL,
 *     months          INTEGER (0..MAX) OPTIONAL,
 *     weeks           INTEGER (0..MAX) OPTIONAL,
 *     days            INTEGER (0..MAX) OPTIONAL,
 *     hours           INTEGER (0..MAX) OPTIONAL,
 *     minutes         INTEGER (0..MAX) OPTIONAL,
 *     seconds         INTEGER (0..MAX) OPTIONAL,
 *     fractional-part SEQUENCE {
 *         number-of-digits    INTEGER (0..MAX),
 *         fractional-value    INTEGER (0..MAX)
 *     } OPTIONAL
 * }`
 *
 * Note that, in addition to the above, several additional restrictions are
 * applied to this structure, which as specified in ITU recommendation X.696.
 */
export default
class DURATION_INTERVAL_ENCODING {
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
                "DURATION-INTERVAL-ENCODING may not combine week components and date-time components.",
            );
        }
        if (years) {
            datetimeComponentValidator("year", 0, Number.MAX_SAFE_INTEGER)("DURATION-INTERVAL-ENCODING", years);
        }
        if (months) {
            datetimeComponentValidator("month", 0, Number.MAX_SAFE_INTEGER)("DURATION-INTERVAL-ENCODING", months);
        }
        if (weeks) {
            datetimeComponentValidator("week", 0, Number.MAX_SAFE_INTEGER)("DURATION-INTERVAL-ENCODING", weeks);
        }
        if (days) {
            datetimeComponentValidator("day", 0, Number.MAX_SAFE_INTEGER)("DURATION-INTERVAL-ENCODING", days);
        }
        if (hours) {
            datetimeComponentValidator("hour", 0, Number.MAX_SAFE_INTEGER)("DURATION-INTERVAL-ENCODING", hours);
        }
        if (minutes) {
            datetimeComponentValidator("minute", 0, Number.MAX_SAFE_INTEGER)("DURATION-INTERVAL-ENCODING", minutes);
        }
        if (seconds) {
            datetimeComponentValidator("second", 0, Number.MAX_SAFE_INTEGER)("DURATION-INTERVAL-ENCODING", seconds);
        }
        if (fractional_part && !Number.isSafeInteger(fractional_part.fractional_value)) {
            throw new errors.ASN1Error("Malformed DURATION-INTERVAL-ENCODING fractional part.");
        }
    }
}
