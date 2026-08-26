import type { SingleThreadUint8Array, TIME_OF_DAY } from "../../../macros.mjs";

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
function encodeTimeOfDay (time: TIME_OF_DAY): SingleThreadUint8Array {
    const hours: number = time.getHours();
    const minutes: number = time.getMinutes();
    const seconds: number = time.getSeconds();
    const bytes: SingleThreadUint8Array = new Uint8Array(6);
    bytes[0] = 0x30 + ((hours / 10) | 0);
    bytes[1] = 0x30 + (hours % 10);
    bytes[2] = 0x30 + ((minutes / 10) | 0);
    bytes[3] = 0x30 + (minutes % 10);
    bytes[4] = 0x30 + ((seconds / 10) | 0);
    bytes[5] = 0x30 + (seconds % 10);
    return bytes;
}
