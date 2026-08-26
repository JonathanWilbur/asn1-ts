import type { DATE_TIME, SingleThreadUint8Array } from "../../../macros.mjs";
import * as errors from "../../../errors.mjs";

export default
function encodeDateTime (value: DATE_TIME): SingleThreadUint8Array {
    const year: number = value.getFullYear();
    if (year < 1582 || year > 9999) {
        throw new errors.ASN1Error(
            `The DATE ${value.toISOString()} may not be encoded, because the `
            + "year must be greater than 1581 and less than 10000.",
        );
    }
    const month: number = value.getMonth() + 1;
    const day: number = value.getDate();
    const hours: number = value.getHours();
    const minutes: number = value.getMinutes();
    const seconds: number = value.getSeconds();
    const bytes: SingleThreadUint8Array = new Uint8Array(14);
    bytes[0] = 0x30 + ((year / 1000) | 0);
    bytes[1] = 0x30 + (((year / 100) | 0) % 10);
    bytes[2] = 0x30 + (((year / 10) | 0) % 10);
    bytes[3] = 0x30 + (year % 10);
    bytes[4] = 0x30 + ((month / 10) | 0);
    bytes[5] = 0x30 + (month % 10);
    bytes[6] = 0x30 + ((day / 10) | 0);
    bytes[7] = 0x30 + (day % 10);
    bytes[8] = 0x30 + ((hours / 10) | 0);
    bytes[9] = 0x30 + (hours % 10);
    bytes[10] = 0x30 + ((minutes / 10) | 0);
    bytes[11] = 0x30 + (minutes % 10);
    bytes[12] = 0x30 + ((seconds / 10) | 0);
    bytes[13] = 0x30 + (seconds % 10);
    return bytes;
}
