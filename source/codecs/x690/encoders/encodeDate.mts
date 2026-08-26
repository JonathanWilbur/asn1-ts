import type { DATE, SingleThreadUint8Array } from "../../../macros.mjs";
import * as errors from "../../../errors.mjs";

export default
function encodeDate (date: DATE): SingleThreadUint8Array {
    const year: number = date.getFullYear();
    if (year < 1582 || year > 9999) {
        throw new errors.ASN1Error(
            `The DATE ${date.toISOString()} may not be encoded, because the `
            + "year must be greater than 1581 and less than 10000.",
        );
    }
    const month: number = date.getMonth() + 1;
    const day: number = date.getDate();
    const bytes: SingleThreadUint8Array = new Uint8Array(8);
    bytes[0] = 0x30 + ((year / 1000) | 0);
    bytes[1] = 0x30 + (((year / 100) | 0) % 10);
    bytes[2] = 0x30 + (((year / 10) | 0) % 10);
    bytes[3] = 0x30 + (year % 10);
    bytes[4] = 0x30 + ((month / 10) | 0);
    bytes[5] = 0x30 + (month % 10);
    bytes[6] = 0x30 + ((day / 10) | 0);
    bytes[7] = 0x30 + (day % 10);
    return bytes;
}
