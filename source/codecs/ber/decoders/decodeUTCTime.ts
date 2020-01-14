import convertBytesToText from "../../../utils/convertBytesToText";
import * as errors from "../../../errors";
import { utcTimeRegex } from "../../../values";
import validateDateTime from "../../../validators/validateDateTime";
import { UTCTime } from "../../../macros";

export default
function decodeUTCTime (value: Uint8Array): UTCTime {
    const dateString: string = convertBytesToText(value);
    const match: RegExpExecArray | null = utcTimeRegex.exec(dateString);
    if (match === null) {
        throw new errors.ASN1Error("Malformed UTCTime string.");
    }
    const ret: Date = new Date();
    let year: number = Number(match[1]);
    year = (year < 70 ? (2000 + year) : (1900 + year));
    const month: number = (Number(match[2]) - 1);
    const date: number = Number(match[3]);
    const hours: number = Number(match[4]);
    const minutes: number = Number(match[5]);
    const seconds: number = Number(match[6]);
    validateDateTime("UTCTime", year, month, date, hours, minutes, seconds);
    ret.setUTCFullYear(year);
    ret.setUTCMonth(month);
    ret.setUTCDate(date);
    ret.setUTCHours(hours);
    ret.setUTCMinutes(minutes);
    ret.setUTCSeconds(seconds);
    return ret;
}
