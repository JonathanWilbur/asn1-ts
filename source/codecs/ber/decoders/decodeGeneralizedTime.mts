import * as errors from "../../../errors.mjs";
import validateDateTime from "../../../validators/validateDateTime.mjs";
import type { GeneralizedTime } from "../../../macros.mjs";
import { decodeDec2, decodeDec4, decodeFraction } from "../../../utils/asciiDecimal.mjs";

/* All that is required is a date and hour. Not even a timezone is required. */
const SMALLEST_CORRECT_GENERALIZED_TIME: number = 10;
const LABEL = "GeneralizedTime";

const enum FractionalUnits {
    Hours,
    Minutes,
    Seconds,
}

function isDigit (byte: number | undefined): boolean {
    return byte !== undefined && byte >= 0x30 && byte <= 0x39;
}

function isStop (byte: number | undefined): boolean {
    return byte === 0x2E || byte === 0x2C;
}

export default
function decodeGeneralizedTime (value: Uint8Array): GeneralizedTime {
    const len: number = value.length;
    if (len < SMALLEST_CORRECT_GENERALIZED_TIME) {
        throw new errors.ASN1Error("Malformed GeneralizedTime string.");
    }
    if (len > 32) {
        throw new errors.ASN1Error("Outrageously large GeneralizedTime string.");
    }
    const year: number = decodeDec4(value, 0, LABEL);
    const month: number = decodeDec2(value, 4, LABEL) - 1;
    const date: number = decodeDec2(value, 6, LABEL);
    const hours: number = decodeDec2(value, 8, LABEL);
    if (len === 10) {
        // No time zone: assumed to be local.
        validateDateTime("GeneralizedTime", year, month, date, hours, 0, 0);
        return new Date(year, month, date, hours, 0, 0);
    }
    let i: number = 10;
    while (i < len && isDigit(value[i])) {
        i++;
    }
    let minutes: number = 0;
    let seconds: number = 0;
    let milliseconds: number = 0;
    let fractionUnits: FractionalUnits = FractionalUnits.Hours;
    if (i === 14) {
        minutes = decodeDec2(value, 10, LABEL);
        seconds = decodeDec2(value, 12, LABEL);
        fractionUnits = FractionalUnits.Seconds;
    } else if (i === 12) {
        minutes = decodeDec2(value, 10, LABEL);
        fractionUnits = FractionalUnits.Minutes;
    } else if (i !== 10) {
        // There was some weird number of digits.
        throw new errors.ASN1Error("Malformed GeneralizedTime string.");
    }
    if (i >= len) {
        // No timezone specified. End of the string.
        validateDateTime("GeneralizedTime", year, month, date, hours, minutes, seconds);
        return new Date(year, month, date, hours, minutes, seconds);
    }
    if (isStop(value[i])) {
        i++;
        const fracStart: number = i;
        while (i < len && isDigit(value[i])) {
            i++;
        }
        const fraction: number = decodeFraction(value, fracStart, i, LABEL);
        if (fractionUnits === FractionalUnits.Hours) {
            minutes = Math.floor(60 * fraction);
            seconds = Math.floor((60 * 60 * fraction) % 60);
        } else if (fractionUnits === FractionalUnits.Minutes) {
            seconds = Math.floor(60 * fraction);
        } else if (fractionUnits === FractionalUnits.Seconds) {
            milliseconds = Math.floor(1000 * fraction);
        }
    }
    if (i >= len) {
        // No timezone specified. End of the string.
        validateDateTime("GeneralizedTime", year, month, date, hours, minutes, seconds);
        return new Date(year, month, date, hours, minutes, seconds, milliseconds);
    }
    if (value[i] === 0x5A) { // Z
        validateDateTime("GeneralizedTime", year, month, date, hours, minutes, seconds);
        return new Date(Date.UTC(year, month, date, hours, minutes, seconds, milliseconds));
    }
    if (value[i] === 0x2B || value[i] === 0x2D) {
        const isPositive: boolean = value[i] === 0x2B;
        i++;
        const offsetStart: number = i;
        while (i < len && isDigit(value[i])) {
            i++;
        }
        const offsetSize: number = i - offsetStart;
        if (i !== len) {
            throw new errors.ASN1Error("Malformed GeneralizedTime string.");
        }
        let offsetHour: number = 0;
        let offsetMinute: number = 0;
        if (offsetSize === 4) {
            offsetHour = decodeDec2(value, offsetStart, LABEL);
            offsetMinute = decodeDec2(value, offsetStart + 2, LABEL);
        } else if (offsetSize === 2) {
            offsetHour = decodeDec2(value, offsetStart, LABEL);
        } else {
            throw new errors.ASN1Error("Malformed GeneralizedTime string.");
        }
        // You do not need to validate the offset. -99 hours still makes sense, although it is weird.
        let epochTimeInMS: number = Date.UTC(year, month, date, hours, minutes, seconds, milliseconds);
        const sign: number = isPositive ? -1 : 1; // You have to reverse the sign to get back to UTC time.
        epochTimeInMS += sign * ((offsetHour * 60 * 60 * 1000) + (offsetMinute * 60 * 1000));
        return new Date(epochTimeInMS);
    }
    if (i < len) {
        throw new errors.ASN1Error("Malformed GeneralizedTime string.");
    }
    validateDateTime("GeneralizedTime", year, month, date, hours, minutes, seconds);
    return new Date(Date.UTC(year, month, date, hours, minutes, seconds, milliseconds));
}
