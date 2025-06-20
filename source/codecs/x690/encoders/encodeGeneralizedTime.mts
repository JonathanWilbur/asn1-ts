import type { GeneralizedTime } from "../../../macros.mjs";
import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";

export default
function encodeGeneralizedTime (value: GeneralizedTime): Uint8Array {
    const year: string = value.getUTCFullYear().toString().padStart(4, "0");
    const month: string = (value.getUTCMonth() + 1).toString().padStart(2, "0");
    const day: string = value.getUTCDate().toString().padStart(2, "0");
    const hour: string = value.getUTCHours().toString().padStart(2, "0");
    const minute: string = value.getUTCMinutes().toString().padStart(2, "0");
    const second: string = value.getUTCSeconds().toString().padStart(2, "0");
    const timeString = `${year}${month}${day}${hour}${minute}${second}Z`;
    return convertTextToBytes(timeString);
}
