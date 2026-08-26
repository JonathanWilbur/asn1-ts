import * as errors from "../../../errors.mjs";
import validateDateTime from "../../../validators/validateDateTime.mjs";
import type { GeneralizedTime } from "../../../macros.mjs";
import { decodeDec2, decodeDec4, decodeFraction } from "../../../utils/asciiDecimal.mjs";

const LABEL = "DER GeneralizedTime";

export default
function decodeGeneralizedTime (value: Uint8Array): GeneralizedTime {
    const len: number = value.length;
    if (len < 15 || value[len - 1] !== 0x5A) {
        throw new errors.ASN1Error("Malformed DER GeneralizedTime string: must use UTC timezone");
    }
    const year: number = decodeDec4(value, 0, LABEL);
    const month: number = decodeDec2(value, 4, LABEL) - 1;
    const date: number = decodeDec2(value, 6, LABEL);
    const hours: number = decodeDec2(value, 8, LABEL);
    const minutes: number = decodeDec2(value, 10, LABEL);
    const seconds: number = decodeDec2(value, 12, LABEL);
    if (value[14] === 0x2E) {
        let i: number = 15;
        while (i < len && value[i] >= 0x30 && value[i] <= 0x39) {
            i++;
        }
        if (i === 15) {
            throw new errors.ASN1Error("Malformed DER GeneralizedTime string: trailing stop character");
        }
        if (value[i] === 0x5A) {
            i++;
        }
        if (i !== len) {
            throw new errors.ASN1Error("Malformed DER GeneralizedTime string: trailing data");
        }
        // Fraction digits are [15, len - 1) because the string ends with Z.
        const fraction: number = decodeFraction(value, 15, len - 1, LABEL);
        const milliseconds: number = Math.floor(1000 * fraction);
        validateDateTime("GeneralizedTime", year, month, date, hours, minutes, seconds);
        return new Date(Date.UTC(year, month, date, hours, minutes, seconds, milliseconds));
    } else if (value[14] !== 0x5A) {
        throw new errors.ASN1Error("Malformed DER GeneralizedTime string: trailing data");
    }
    validateDateTime("GeneralizedTime", year, month, date, hours, minutes, seconds);
    return new Date(Date.UTC(year, month, date, hours, minutes, seconds));
}
