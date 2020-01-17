import { INTEGER } from "../../macros";
import datetimeComponentValidator from "../../validators/datetimeComponentValidator";

/**
 * Defined in ITU Recommendation X.696:2015, Section 29:
 *
 * `TIME-OF-DAY-DIFF-ENCODING ::= SEQUENCE {
 *     hours           INTEGER (0..24),
 *     minutes         INTEGER (0..59),
 *     seconds         INTEGER (0..60),
 *     minutes-diff    INTEGER (-900..900)
 * }`
 */
export default
class TIME_OF_DAY_DIFF_ENCODING {
    constructor (
        readonly hours: INTEGER,
        readonly minutes: INTEGER,
        readonly seconds: INTEGER,
        readonly minutes_diff: INTEGER,
    ) {
        datetimeComponentValidator("hour", 0, 24)("TIME-OF-DAY-DIFF-ENCODING", hours);
        datetimeComponentValidator("minute", 0, 59)("TIME-OF-DAY-DIFF-ENCODING", minutes);
        datetimeComponentValidator("seconds", 0, 60)("TIME-OF-DAY-DIFF-ENCODING", seconds);
        datetimeComponentValidator("minute-diff", -900, 900)("TIME-OF-DAY-DIFF-ENCODING", minutes_diff);
    }
}
