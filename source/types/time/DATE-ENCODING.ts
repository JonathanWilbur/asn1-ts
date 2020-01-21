import { INTEGER } from "../../macros";
import datetimeComponentValidator from "../../validators/datetimeComponentValidator";

/**
 * Defined in ITU Recommendation X.696:2015, Section 29:
 *
 * `DATE-ENCODING ::= SEQUENCE {
 *     year     INTEGER,
 *     month    INTEGER (1..12),
 *     day      INTEGER (1..31)
 * }`
 */
export default
class DATE_ENCODING {
    constructor (
        readonly year: INTEGER,
        readonly month: INTEGER,
        readonly day: INTEGER,
    ) {
        datetimeComponentValidator("month", 1, 12)("DATE-ENCODING", month);
        datetimeComponentValidator("day", 1, 31)("DATE-ENCODING", day);
    }
}
