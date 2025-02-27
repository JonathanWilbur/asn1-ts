import * as errors from "../../../errors.mjs";
import convertBytesToText from "../../../utils/convertBytesToText.mjs";
import validateDateTime from "../../../validators/validateDateTime.mjs";
import { GeneralizedTime } from "../../../macros.mjs";

/* All that is required is a date and hour. Not even a timezone is required. */
const SMALLEST_CORRECT_GENERALIZED_TIME: number = "2000120123".length;

const PERIOD = ".".charCodeAt(0);
const COMMA = ",".charCodeAt(0);
const Z = "Z".charCodeAt(0);
const PLUS = "+".charCodeAt(0);
const MINUS = "-".charCodeAt(0);

const enum FractionalUnits {
    Hours,
    Minutes,
    Seconds,
};

function isStop (s: string, i: number): boolean {
    const char = s.charCodeAt(i);
    return (char === PERIOD) || (char === COMMA);
}

export default
function decodeGeneralizedTime (value: Uint8Array): GeneralizedTime {
    if (value.length < SMALLEST_CORRECT_GENERALIZED_TIME) {
        throw new errors.ASN1Error("Malformed GeneralizedTime string.");
    }
    if (value.length > 32) {
        throw new errors.ASN1Error("Outrageously large GeneralizedTime string.");
    }
    const dateString: string = convertBytesToText(value);
    const year: number = Number(dateString.slice(0, 4));
    const month: number = (Number(dateString.slice(4, 6)) - 1);
    const date: number = Number(dateString.slice(6, 8));
    const hours: number = Number(dateString.slice(8, 10));
    if (value.length === 10) {
        // No time zone: assumed to be local.
        validateDateTime("GeneralizedTime", year, month, date, hours, 0, 0);
        return new Date(year, month, date, hours, 0, 0);
    }
    let i = 10;
    while (value[i] && value[i] >= 0x30 && value[i] <= 0x39)
        i++;
    let minutes: number = 0;
    let seconds: number = 0;
    let milliseconds: number = 0;
    let fractionUnits = FractionalUnits.Hours;
    if (i == 14) {
        minutes = Number.parseInt(dateString.slice(10, 12), 10);
        seconds = Number.parseInt(dateString.slice(12, 14), 10);
        fractionUnits = 2;
    } else if (i == 12) {
        minutes = Number.parseInt(dateString.slice(10, 12), 10);
        fractionUnits = 1;
    } else if (i != 10) {
        // There was some weird number of digits.
        throw new errors.ASN1Error("Malformed GeneralizedTime string.");
    }
    if (value[i] === undefined) {
        // No timezone specified. End of the string.
        validateDateTime("GeneralizedTime", year, month, date, hours, minutes, seconds);
        return new Date(year, month, date, hours, minutes, seconds);
    }
    if (isStop(dateString, i)) {
        i++;
        let j = i;
        while (value[j] && value[j] >= 0x30 && value[j] <= 0x39)
            j++;
        const fractionString = `0.${dateString.slice(i, j)}`;
        i = j;
        const fraction = Number.parseFloat(fractionString);
        if (fractionUnits === FractionalUnits.Hours) {
            minutes = Math.floor(60 * fraction);
            seconds = Math.floor((60 * 60 * fraction) % 60);
        } else if (fractionUnits === FractionalUnits.Minutes) {
            seconds = Math.floor(60 * fraction);
        } else if (fractionUnits === FractionalUnits.Seconds) {
            milliseconds = Math.floor(1000 * fraction);
        } else {
            throw new Error("internal asn1-ts error: invalid FractionalUnits");
        }
    }
    if (value[i] === undefined) {
        // No timezone specified. End of the string.
        validateDateTime("GeneralizedTime", year, month, date, hours, minutes, seconds);
        return new Date(year, month, date, hours, minutes, seconds, milliseconds);
    }
    if (value[i] === Z) {
        validateDateTime("GeneralizedTime", year, month, date, hours, minutes, seconds);
        return new Date(Date.UTC(year, month, date, hours, minutes, seconds, milliseconds));
    }
    if (value[i] === PLUS || value[i] === MINUS) {
        const isPositive: boolean = value[i] === PLUS;
        // What follows is the timezone offset.
        i++;
        let j = i;
        while (value[j] && value[j] >= 0x30 && value[j] <= 0x39)
            j++;
        const offsetSize = j - i;
        // The Timezone offset is the last thing that may appear.
        // If this isn't the end of the string, throw an error.
        if (value[j] !== undefined) {
            throw new errors.ASN1Error("Malformed GeneralizedTime string.");
        }
        let offsetHour: number = 0;
        let offsetMinute: number = 0;
        if (offsetSize === 4) {
            offsetHour = Number.parseInt(dateString.slice(j - 4, j - 2), 10);
            offsetMinute = Number.parseInt(dateString.slice(j - 2, j), 10);
        } else if (offsetSize === 2) {
            offsetHour = Number.parseInt(dateString.slice(j - 2, j));
        } else {
            throw new errors.ASN1Error("Malformed GeneralizedTime string.");
        }
        // You do not need to validate the offset. -99 hours still makes sense, although it is weird.
        let epochTimeInMS = Date.UTC(year, month, date, hours, minutes, seconds, milliseconds);
        const sign = isPositive ? -1 : 1; // You have to reverse the sign to get back to UTC time.
        epochTimeInMS += sign * ((offsetHour * 60 * 60 * 1000) + (offsetMinute * 60 * 1000));
        return new Date(epochTimeInMS);
    }
    if (value[i] !== undefined) {
        throw new errors.ASN1Error("Malformed GeneralizedTime string.");
    }
    validateDateTime("GeneralizedTime", year, month, date, hours, minutes, seconds);
    return new Date(Date.UTC(year, month, date, hours, minutes, seconds, milliseconds));
}

