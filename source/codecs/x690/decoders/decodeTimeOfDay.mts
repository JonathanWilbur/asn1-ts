import type { TIME_OF_DAY } from "../../../macros.mjs";
import validateTime from "../../../validators/validateTime.mjs";
import { ASN1CharactersError, ASN1Error } from "../../../errors.mjs";

function decodeDecimalDigit (byte: number): number {
    const digit: number = byte - 0x30;
    if ((digit >>> 0) > 9) {
        throw new ASN1CharactersError(
            `TIME-OF-DAY can only contain digits. Encountered character code ${byte}.`,
        );
    }
    return digit;
}

export default
function decodeTimeOfDay (bytes: Uint8Array): TIME_OF_DAY {
    if (bytes.length !== 6) {
        throw new ASN1Error("TIME-OF-DAY must contain exactly 6 digits (HHMMSS).");
    }
    const hours: number = (
        decodeDecimalDigit(bytes[0]) * 10
        + decodeDecimalDigit(bytes[1])
    );
    const minutes: number = (
        decodeDecimalDigit(bytes[2]) * 10
        + decodeDecimalDigit(bytes[3])
    );
    const seconds: number = (
        decodeDecimalDigit(bytes[4]) * 10
        + decodeDecimalDigit(bytes[5])
    );
    validateTime("TIME-OF-DAY", hours, minutes, seconds);
    const ret: Date = new Date();
    ret.setHours(hours);
    ret.setMinutes(minutes);
    ret.setSeconds(seconds);
    return ret;
}
