import type { DATE, SingleThreadUint8Array } from "../../../macros.mjs";
import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";
import * as errors from "../../../errors.mjs";

export default
function encodeDate (date: DATE): SingleThreadUint8Array {
    if (date.getFullYear() < 1582 || date.getFullYear() > 9999) {
        throw new errors.ASN1Error(
            `The DATE ${date.toISOString()} may not be encoded, because the `
            + "year must be greater than 1581 and less than 10000.",
        );
    }
    // NOTE: Using .toISOString() will not work, because it is in UTC time.
    return convertTextToBytes(
        date.getFullYear().toString().padStart(4, "0")
        + (date.getMonth() + 1).toString().padStart(2, "0")
        + date.getDate().toString().padStart(2, "0"),
    );
}
