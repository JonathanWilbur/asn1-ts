import { INTEGER } from "../../macros.mjs";
import datetimeComponentValidator from "../../validators/datetimeComponentValidator.mjs";

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
}
