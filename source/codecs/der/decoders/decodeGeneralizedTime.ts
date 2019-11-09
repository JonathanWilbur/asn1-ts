import convertBytesToText from "../../../convertBytesToText";
import { generalizedTimeRegex } from "../../../values";
import * as errors from "../../../errors";
import validateDateTime from "../../../validateDateTime";

export default
function decodeGeneralizedTime (value: Uint8Array): Date {
    const dateString: string = convertBytesToText(value);
    const match: RegExpExecArray | null = generalizedTimeRegex.exec(dateString);
    if (match === null) {
        throw new errors.ASN1Error("Malformed GeneralizedTime string.");
    }
    const ret: Date = new Date();
    const year: number = Number(match[1]);
    const month: number = (Number(match[2]) - 1);
    const date: number = Number(match[3]);
    const hours: number = Number(match[4]);
    const minutes: number = Number(match[5]);
    const seconds: number = Number(match[6]);
    validateDateTime("GeneralizedTime", year, month, date, hours, minutes, seconds);
    ret.setUTCFullYear(year);
    ret.setUTCMonth(month);
    ret.setUTCDate(date);
    ret.setUTCHours(hours);
    ret.setUTCMinutes(minutes);
    ret.setUTCSeconds(seconds);
    return ret;
}
