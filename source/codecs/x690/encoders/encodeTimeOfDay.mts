import type { TIME_OF_DAY } from "../../../macros.mjs";
import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";

/**
 * Note that, even though it might seem like this should have a leading "T",
 * the specification notes that the leading "T" should not be included in
 * the abstract value notation when the time string is of type "Time."
 * This is specified in ITU X.680 2015, Section 38.3.3, in Table 7, in the
 * first "Hours component" row. (There are two of them, the first of which
 * is for "Time" types.)
 *
 * @param time {TIME_OF_DAY} The time to be encoded.
 */
export default
function encodeTimeOfDay (time: TIME_OF_DAY): Uint8Array {
    return convertTextToBytes(
        time.getHours().toString().padStart(2, "0")
        + time.getMinutes().toString().padStart(2, "0")
        + time.getSeconds().toString().padStart(2, "0")
    );
}
