import { INTEGER } from "../../macros.mjs";

/**
 * Defined in ITU Recommendation X.696:2015, Section 29:
 *
 * `YEAR-ENCODING ::= SEQUENCE {
 *     year     INTEGER
 * }`
 */
export default
class YEAR_ENCODING {
    constructor (
        readonly year: INTEGER,
    ) {}
}
