import * as errors from "../errors";

export default function validateTime (
    dataType: string,
    hours: number,
    minutes: number,
    seconds: number,
): void {
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
