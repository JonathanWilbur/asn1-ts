import convertBytesToText from "../../../utils/convertBytesToText.mjs";
import * as errors from "../../../errors.mjs";
import validateDateTime from "../../../validators/validateDateTime.mjs";
import type { UTCTime } from "../../../macros.mjs";

export default
function decodeUTCTime (value: Uint8Array): UTCTime {
    const dateString: string = convertBytesToText(value);
    let year: number = Number(dateString.slice(0, 2));
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
    const month: number = (Number(dateString.slice(2, 4)) - 1);
    const date: number = Number(dateString.slice(4, 6));
    const hours: number = Number(dateString.slice(6, 8));
    const minutes: number = Number(dateString.slice(8, 10));
    const char10 = dateString.charCodeAt(10);
    const secondsFieldPresent = (char10 >= 0x30 && char10 <= 0x39); // Is it a digit?
    const seconds: number = secondsFieldPresent
        ? Number(dateString.slice(10, 12))
        : 0;
    let i = secondsFieldPresent ? 12 : 10;
    if (dateString[i] === 'Z') {
        validateDateTime("UTCTime", year, month, date, hours, minutes, seconds);
        return new Date(Date.UTC(year, month, date, hours, minutes, seconds));
    }
    if ((dateString[i] !== '+') && (dateString[i] !== '-')) {
        throw new errors.ASN1Error(`Malformed BER UTCTime: non +/- offset: ${dateString[i]}`);
    }
    const isPositive: boolean = dateString[i] === '+';
    i++;
    let j = 0;
    while (value[i + j] && value[i + j] >= 0x30 && value[i + j] <= 0x39)
        j++;
    if (j !== 4) {
        throw new errors.ASN1Error("Malformed BER UTCTime: non four-digit offset");
    }
    i += j;
    if (dateString[i] !== undefined) {
        throw new errors.ASN1Error("Malformed BER UTCTime: trailing data");
    }
    const offsetHour = Number.parseInt(dateString.slice(i - 4, i - 2), 10);
    const offsetMinute = Number.parseInt(dateString.slice(i - 2, i), 10);
    // You do not need to validate the offset. -99 hours still makes sense, although it is weird.
    let epochTimeInMS = Date.UTC(year, month, date, hours, minutes, seconds);
    const sign = isPositive ? -1 : 1; // You have to reverse the sign to get back to UTC time.
    epochTimeInMS += sign * ((offsetHour * 60 * 60 * 1000) + (offsetMinute * 60 * 1000));
    return new Date(epochTimeInMS);
}
