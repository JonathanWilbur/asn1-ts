import * as errors from "../../../errors.mjs";
import validateDateTime from "../../../validators/validateDateTime.mjs";
import type { UTCTime } from "../../../macros.mjs";
import { decodeDec2 } from "../../../utils/asciiDecimal.mjs";

const DER_UTC_TIME_LENGTH: number = 13;
const LABEL = "DER UTCTime";

export default
function decodeUTCTime (value: Uint8Array): UTCTime {
    if (value.length !== DER_UTC_TIME_LENGTH) {
        throw new errors.ASN1Error("Malformed DER UTCTime string: not a valid length");
    }
    if (value[12] !== 0x5A) {
        throw new errors.ASN1Error("Malformed DER UTCTime string: not UTC timezone");
    }
    let year: number = decodeDec2(value, 0, LABEL);
    const month: number = decodeDec2(value, 2, LABEL) - 1;
    const date: number = decodeDec2(value, 4, LABEL);
    const hours: number = decodeDec2(value, 6, LABEL);
    const minutes: number = decodeDec2(value, 8, LABEL);
    const seconds: number = decodeDec2(value, 10, LABEL);
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
