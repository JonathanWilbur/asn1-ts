import type { INTEGER } from "../../macros.mjs";
import datetimeComponentValidator from "../../validators/datetimeComponentValidator.mjs";

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
    constructor (
        readonly hours: INTEGER,
        readonly minutes: INTEGER,
        readonly seconds: INTEGER,
    ) {
        datetimeComponentValidator("hour", 0, 24)("TIME-OF-DAY-ENCODING", hours);
        datetimeComponentValidator("minute", 0, 59)("TIME-OF-DAY-ENCODING", minutes);
        datetimeComponentValidator("seconds", 0, 60)("TIME-OF-DAY-ENCODING", seconds);
    }
}
