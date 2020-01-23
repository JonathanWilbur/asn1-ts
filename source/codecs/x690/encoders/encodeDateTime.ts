import { DATE_TIME } from "../../../macros";
import convertTextToBytes from "../../../utils/convertTextToBytes";
import * as errors from "../../../errors";

export default
function encodeDateTime (value: DATE_TIME): Uint8Array {
    if (value.getFullYear() < 1582 || value.getFullYear() > 9999) {
        throw new errors.ASN1Error(
            `The DATE ${value.toISOString()} may not be encoded, because the `
            + "year must be greater than 1581 and less than 10000.",
        );
    }
    // NOTE: Using .toISOString() will not work, because it is in UTC time.
    return convertTextToBytes(
        value.getFullYear().toString()
        + (value.getMonth() + 1).toString().padStart(2, "0")
        + value.getDate().toString().padStart(2, "0")
        + value.getHours().toString().padStart(2, "0")
        + value.getMinutes().toString().padStart(2, "0")
        + value.getSeconds().toString().padStart(2, "0"),
    );
}
