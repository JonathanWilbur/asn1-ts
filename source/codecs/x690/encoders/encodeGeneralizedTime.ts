import { GeneralizedTime } from "../../../macros";
import convertTextToBytes from "../../../utils/convertTextToBytes";

export default
function encodeGeneralizedTime (value: GeneralizedTime): Uint8Array {
    const year: string = value.getUTCFullYear().toString();
    const month: string = (value.getUTCMonth() < 9 ? `0${value.getUTCMonth() + 1}` : `${value.getUTCMonth() + 1}`);
    const day: string = (value.getUTCDate() < 10 ? `0${value.getUTCDate()}` : `${value.getUTCDate()}`);
    const hour: string = (value.getUTCHours() < 10 ? `0${value.getUTCHours()}` : `${value.getUTCHours()}`);
    const minute: string = (value.getUTCMinutes() < 10 ? `0${value.getUTCMinutes()}` : `${value.getUTCMinutes()}`);
    const second: string = (value.getUTCSeconds() < 10 ? `0${value.getUTCSeconds()}` : `${value.getUTCSeconds()}`);
    const timeString = `${year}${month}${day}${hour}${minute}${second}Z`;
    return convertTextToBytes(timeString);
}
