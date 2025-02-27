import * as errors from "../errors.mjs";

export default function validateTime (
    dataType: string,
    hours: number,
    minutes: number,
    seconds: number,
): void {
    if (!Number.isSafeInteger(hours)) {
        throw new errors.ASN1Error(`Invalid hours in ${dataType}`);
    }
    if (!Number.isSafeInteger(minutes)) {
        throw new errors.ASN1Error(`Invalid minutes in ${dataType}`);
    }
    if (!Number.isSafeInteger(seconds) || (seconds < 0)) {
        throw new errors.ASN1Error(`Invalid seconds in ${dataType}`);
    }
    if (hours > 23) {
        throw new errors.ASN1Error(`Hours > 23 encountered in ${dataType}.`);
    }
    if (minutes > 59) {
        throw new errors.ASN1Error(`Minutes > 60 encountered in ${dataType}.`);
    }
    if (seconds > 59) {
        throw new errors.ASN1Error(`Seconds > 60 encountered in ${dataType}.`);
    }
}
