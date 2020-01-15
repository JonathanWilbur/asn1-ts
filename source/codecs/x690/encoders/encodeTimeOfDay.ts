import { TIME_OF_DAY } from "../../../macros";
import convertTextToBytes from "../../../utils/convertTextToBytes";

export default
function encodeTimeOfDay (time: TIME_OF_DAY): Uint8Array {
    return convertTextToBytes(`${time.getHours()}${time.getMinutes()}${time.getSeconds()}`);
}
