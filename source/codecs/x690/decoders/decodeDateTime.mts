import type { DATE_TIME } from "../../../macros.mjs";
import validateDateTime from "../../../validators/validateDateTime.mjs";
import { ASN1CharactersError, ASN1Error } from "../../../errors.mjs";

function decodeDecimalDigit (byte: number): number {
    const digit: number = byte - 0x30;
    if ((digit >>> 0) > 9) {
        throw new ASN1CharactersError(
            `DATE-TIME can only contain digits. Encountered character code ${byte}.`,
        );
    }
    return digit;
}

export default
function decodeDateTime (bytes: Uint8Array): DATE_TIME {
    if (bytes.length !== 14) {
        throw new ASN1Error("DATE-TIME must contain exactly 14 digits (YYYYMMDDHHMMSS).");
    }
    const year: number = (
        decodeDecimalDigit(bytes[0]) * 1000
        + decodeDecimalDigit(bytes[1]) * 100
        + decodeDecimalDigit(bytes[2]) * 10
        + decodeDecimalDigit(bytes[3])
    );
    const month: number = (
        decodeDecimalDigit(bytes[4]) * 10
        + decodeDecimalDigit(bytes[5])
        - 1
    );
    const day: number = (
        decodeDecimalDigit(bytes[6]) * 10
        + decodeDecimalDigit(bytes[7])
    );
    const hours: number = (
        decodeDecimalDigit(bytes[8]) * 10
        + decodeDecimalDigit(bytes[9])
    );
    const minutes: number = (
        decodeDecimalDigit(bytes[10]) * 10
        + decodeDecimalDigit(bytes[11])
    );
    const seconds: number = (
        decodeDecimalDigit(bytes[12]) * 10
        + decodeDecimalDigit(bytes[13])
    );
    validateDateTime("DATE-TIME", year, month, day, hours, minutes, seconds);
    return new Date(year, month, day, hours, minutes, seconds);
}
