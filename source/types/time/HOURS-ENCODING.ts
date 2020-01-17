import { INTEGER } from "../../macros";
import datetimeComponentValidator from "../../validators/datetimeComponentValidator";

/**
 * Defined in ITU Recommendation X.696:2015, Section 29:
 *
 * `HOURS-ENCODING ::= SEQUENCE {
 *      hours   INTEGER (0..24)
 * }`
 */
export default
class HOURS_ENCODING {
    constructor (
        readonly hours: INTEGER,
    ) {
        datetimeComponentValidator("hour", 0, 24)("HOURS-ENCODING", hours);
    }
}
