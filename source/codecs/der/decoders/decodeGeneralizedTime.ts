import convertBytesToText from "../../../utils/convertBytesToText";
import * as errors from "../../../errors";
import validateDateTime from "../../../validators/validateDateTime";
import { GeneralizedTime } from "../../../macros";

export default
function decodeGeneralizedTime (value: Uint8Array): GeneralizedTime {
    const dateString: string = convertBytesToText(value);
    if (!dateString.endsWith("Z")) {
        throw new errors.ASN1Error("Malformed DER GeneralizedTime string: must use UTC timezone");
    }
    const year: number = Number(dateString.slice(0, 4));
    const month: number = (Number(dateString.slice(4, 6)) - 1);
    const date: number = Number(dateString.slice(6, 8));
    const hours: number = Number(dateString.slice(8, 10));
    const minutes: number = Number(dateString.slice(10, 12));
    const seconds: number = Number(dateString.slice(12, 14));
    if (dateString[14] === '.') {
        let i = 15;
        while (value[i] && value[i] >= 0x30 && value[i] <= 0x39)
            i++;
        if (i === 15) {
            throw new errors.ASN1Error("Malformed DER GeneralizedTime string: trailing stop character");
        }
        if (dateString[i] === 'Z') {
            i++;
        }
        if (dateString[i] !== undefined) {
            throw new errors.ASN1Error("Malformed DER GeneralizedTime string: trailing data");
        }
        const fractionString = `0.${dateString.slice(15, i)}`;
        if (fractionString.endsWith("0")) {
            throw new errors.ASN1Error("Malformed DER GeneralizedTime string: trailing 0 in milliseconds");
        }
        const fraction = Number.parseFloat(fractionString);
        const milliseconds = Math.floor(1000 * fraction);
        validateDateTime("GeneralizedTime", year, month, date, hours, minutes, seconds);
        return new Date(Date.UTC(year, month, date, hours, minutes, seconds, milliseconds));
    } else if (dateString[14] !== 'Z') {
        throw new errors.ASN1Error("Malformed DER GeneralizedTime string: trailing data");
    }
    validateDateTime("GeneralizedTime", year, month, date, hours, minutes, seconds);
    return new Date(Date.UTC(year, month, date, hours, minutes, seconds));
}
