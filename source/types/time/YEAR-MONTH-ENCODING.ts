import { INTEGER } from "../../macros";
import datetimeComponentValidator from "../../validators/datetimeComponentValidator";

/**
 * Defined in ITU Recommendation X.696:2015, Section 29:
 *
 * `YEAR-MONTH-ENCODING ::= SEQUENCE {
 *     year     INTEGER,
 *     month    INTEGER (1..12)
 * }`
 */
export default
class YEAR_MONTH_ENCODING {
    constructor (
        readonly year: INTEGER,
        readonly month: INTEGER,
    ) {
        datetimeComponentValidator("month", 1, 12)("YEAR-MONTH-ENCODING", month);
    }
}
