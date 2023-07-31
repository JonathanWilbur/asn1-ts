import convertBytesToText from "../../../utils/convertBytesToText";
import { distinguishedGeneralizedTimeRegex } from "../../../values";
import * as errors from "../../../errors";
import validateDateTime from "../../../validators/validateDateTime";
import { GeneralizedTime } from "../../../macros";

export default
function decodeGeneralizedTime (value: Uint8Array): GeneralizedTime {
    const dateString: string = convertBytesToText(value);
    const match: RegExpExecArray | null = distinguishedGeneralizedTimeRegex.exec(dateString);
    if (match === null) {
        throw new errors.ASN1Error("Malformed GeneralizedTime string.");
    }
    const year: number = Number(match[1]);
    const month: number = (Number(match[2]) - 1);
    const date: number = Number(match[3]);
    const hours: number = Number(match[4]);
    const minutes: number = Number(match[5]);
    const seconds: number = Number(match[6]);
    validateDateTime("GeneralizedTime", year, month, date, hours, minutes, seconds);
    return new Date(Date.UTC(year, month, date, hours, minutes, seconds));
}
