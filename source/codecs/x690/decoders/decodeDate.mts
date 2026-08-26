import type { DATE } from "../../../macros.mjs";
import validateDate from "../../../validators/validateDate.mjs";
import { ASN1CharactersError, ASN1Error } from "../../../errors.mjs";

function decodeDecimalDigit (byte: number): number {
    const digit: number = byte - 0x30;
    if ((digit >>> 0) > 9) {
        throw new ASN1CharactersError(
            `DATE can only contain digits. Encountered character code ${byte}.`,
        );
    }
    return digit;
}

export default
function decodeDate (bytes: Uint8Array): DATE {
    if (bytes.length !== 8) {
        throw new ASN1Error("DATE must contain exactly 8 digits (YYYYMMDD).");
    }
    // Benchmarks prove this to be faster than converting to text
    // and parsing integers from it.
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
    validateDate("DATE", year, month, day);
    return new Date(year, month, day);
}
