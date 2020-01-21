import { INTEGER } from "../../macros";
import datetimeComponentValidator from "../../validators/datetimeComponentValidator";

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
    constructor (
        readonly hours: INTEGER,
        readonly minutes: INTEGER,
    ) {
        datetimeComponentValidator("hour", 0, 24)("HOURS-MINUTES-ENCODING", hours);
        datetimeComponentValidator("minute", 0, 59)("HOURS-MINUTES-ENCODING", minutes);
    }
}
