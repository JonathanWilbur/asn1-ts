import type { INTEGER } from "../../macros.mjs";
import datetimeComponentValidator from "../../validators/datetimeComponentValidator.mjs";

/**
 * Defined in ITU Recommendation X.696:2015, Section 29:
 *
 * `HOURS-MINUTES-DIFF-ENCODING ::= SEQUENCE {
 *     hours           INTEGER (0..24),
 *     minutes         INTEGER (0..59),
 *     minutes-diff    INTEGER (-900..900)
 * }`
 */
export default
class HOURS_MINUTES_DIFF_ENCODING {
    constructor (
        readonly hours: INTEGER,
        readonly minutes: INTEGER,
        readonly minutes_diff: INTEGER,
    ) {
        datetimeComponentValidator("hour", 0, 24)("HOURS-MINUTES-DIFF-ENCODING", hours);
        datetimeComponentValidator("minute", 0, 59)("HOURS-MINUTES-DIFF-ENCODING", minutes);
        datetimeComponentValidator("minute-diff", -900, 900)("HOURS-MINUTES-DIFF-ENCODING", minutes_diff);
    }
}
