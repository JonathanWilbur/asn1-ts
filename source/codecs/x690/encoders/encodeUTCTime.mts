import type { UTCTime } from "../../../macros.mjs";
import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";

export default
function encodeUTCTime (value: UTCTime): Uint8Array {
    let year: string = value.getUTCFullYear().toString();
    year = (year.substring(year.length - 2, year.length)).padStart(2, "0"); // Will fail if you supply a <2 digit date.
    const month: string = (value.getUTCMonth() + 1).toString().padStart(2, "0");
    const day: string = value.getUTCDate().toString().padStart(2, "0");
    const hour: string = value.getUTCHours().toString().padStart(2, "0");
    const minute: string = value.getUTCMinutes().toString().padStart(2, "0");
    const second: string = value.getUTCSeconds().toString().padStart(2, "0");
    const utcString = `${year}${month}${day}${hour}${minute}${second}Z`;
    return convertTextToBytes(utcString);
}
