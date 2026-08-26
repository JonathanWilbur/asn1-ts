import * as errors from "../../../errors.mjs";
import validateDateTime from "../../../validators/validateDateTime.mjs";
import type { UTCTime } from "../../../macros.mjs";
import { decodeDec2 } from "../../../utils/asciiDecimal.mjs";

const LABEL = "BER UTCTime";

export default
function decodeUTCTime (value: Uint8Array): UTCTime {
    const len: number = value.length;
    if (len < 11) {
        throw new errors.ASN1Error("Malformed BER UTCTime.");
    }
    let year: number = decodeDec2(value, 0, LABEL);
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
    const month: number = decodeDec2(value, 2, LABEL) - 1;
    const date: number = decodeDec2(value, 4, LABEL);
    const hours: number = decodeDec2(value, 6, LABEL);
    const minutes: number = decodeDec2(value, 8, LABEL);
    const c10: number = value[10];
    const secondsFieldPresent: boolean = (c10 >= 0x30 && c10 <= 0x39);
    let seconds: number = 0;
    let i: number = 10;
    if (secondsFieldPresent) {
        seconds = decodeDec2(value, 10, LABEL);
        i = 12;
    }
    if (i >= len) {
        throw new errors.ASN1Error("Malformed BER UTCTime.");
    }
    if (value[i] === 0x5A) { // Z
        validateDateTime("UTCTime", year, month, date, hours, minutes, seconds);
        return new Date(Date.UTC(year, month, date, hours, minutes, seconds));
    }
    if ((value[i] !== 0x2B) && (value[i] !== 0x2D)) {
        throw new errors.ASN1Error(`Malformed BER UTCTime: non +/- offset: ${String.fromCharCode(value[i])}`);
    }
    const isPositive: boolean = value[i] === 0x2B;
    i++;
    if ((len - i) !== 4) {
        throw new errors.ASN1Error("Malformed BER UTCTime: non four-digit offset");
    }
    const offsetHour: number = decodeDec2(value, i, LABEL);
    const offsetMinute: number = decodeDec2(value, i + 2, LABEL);
    // You do not need to validate the offset. -99 hours still makes sense, although it is weird.
    let epochTimeInMS: number = Date.UTC(year, month, date, hours, minutes, seconds);
    const sign: number = isPositive ? -1 : 1; // You have to reverse the sign to get back to UTC time.
    epochTimeInMS += sign * ((offsetHour * 60 * 60 * 1000) + (offsetMinute * 60 * 1000));
    return new Date(epochTimeInMS);
}
