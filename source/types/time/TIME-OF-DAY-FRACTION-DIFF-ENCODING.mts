import { INTEGER } from "../../macros.mjs";
import datetimeComponentValidator from "../../validators/datetimeComponentValidator.mjs";

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
}
