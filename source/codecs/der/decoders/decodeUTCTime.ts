import convertBytesToText from "../../../utils/convertBytesToText";
import * as errors from "../../../errors";
import validateDateTime from "../../../validators/validateDateTime";
import { UTCTime } from "../../../macros";

const DER_UTC_TIME_LENGTH = "920521000000Z".length;

export default
function decodeUTCTime (value: Uint8Array): UTCTime {
    if (value.length !== DER_UTC_TIME_LENGTH) {
        throw new errors.ASN1Error("Malformed DER UTCTime string: not a valid length");
    }
    const dateString: string = convertBytesToText(value);
    if (!dateString.endsWith("Z")) {
        throw new errors.ASN1Error("Malformed DER UTCTime string: not UTC timezone");
    }
    let year: number = Number(dateString.slice(0, 2));
    const month: number = (Number(dateString.slice(2, 4)) - 1);
    const date: number = Number(dateString.slice(4, 6));
    const hours: number = Number(dateString.slice(6, 8));
    const minutes: number = Number(dateString.slice(8, 10));
    const seconds: number = Number(dateString.slice(10, 12));
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
    validateDateTime("UTCTime", year, month, date, hours, minutes, seconds);
    return new Date(Date.UTC(year, month, date, hours, minutes, seconds));
}
