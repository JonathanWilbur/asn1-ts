import type { TIME_OF_DAY } from "../../../macros.mjs";
import convertBytesToText from "../../../utils/convertBytesToText.mjs";
import validateTime from "../../../validators/validateTime.mjs";

export default
function decodeTimeOfDay (bytes: Uint8Array): TIME_OF_DAY {
    const str: string = convertBytesToText(bytes);
    const hours: number = parseInt(str.slice(0, 2), 10);
    const minutes: number = parseInt(str.slice(2, 4), 10);
    const seconds: number = parseInt(str.slice(4, 6), 10);
    validateTime("TIME-OF-DAY", hours, minutes, seconds);
    const ret: Date = new Date();
    ret.setHours(hours);
    ret.setMinutes(minutes);
    ret.setSeconds(seconds);
    return ret;
}
