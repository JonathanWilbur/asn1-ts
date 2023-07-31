import convertBytesToText from "../../../utils/convertBytesToText";
import { distinguishedUTCTimeRegex } from "../../../values";
import * as errors from "../../../errors";
import validateDateTime from "../../../validators/validateDateTime";
import { UTCTime } from "../../../macros";

export default
function decodeUTCTime (value: Uint8Array): UTCTime {
    const dateString: string = convertBytesToText(value);
    const match: RegExpExecArray | null = distinguishedUTCTimeRegex.exec(dateString);
    if (match === null) {
        throw new errors.ASN1Error("Malformed UTCTime string.");
    }
    let year: number = Number(match[1]);
    /**
     * The ITU specifications for ASN.1 and related codecs do not specify what
     * century the year digits of a UTCTime value refers to. However, ITU
     * Recommendation X.509 (2019), Section 7.2, states that the `utcTime`
     * alternative of the `Time` type shall be interpreted as being year 20XX if
     * XX is between 0 and 49 inclusive, and 19XX otherwise.
     */
    year = (year <= 49)
        ? (2000 + year)
        : (1900 + year);
    const month: number = (Number(match[2]) - 1);
    const date: number = Number(match[3]);
    const hours: number = Number(match[4]);
    const minutes: number = Number(match[5]);
    const seconds: number = Number(match[6]);
    validateDateTime("UTCTime", year, month, date, hours, minutes, seconds);
    return new Date(Date.UTC(year, month, date, hours, minutes, seconds));
}
