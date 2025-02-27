import { DATE_TIME } from "../../../macros.mjs";
import convertBytesToText from "../../../utils/convertBytesToText.mjs";
import validateDateTime from "../../../validators/validateDateTime.mjs";

export default
function decodeDateTime (bytes: Uint8Array): DATE_TIME {
    const str: string = convertBytesToText(bytes);
    const year: number = parseInt(str.slice(0, 4), 10);
    const month: number = parseInt(str.slice(4, 6), 10) - 1;
    const day: number = parseInt(str.slice(6, 8), 10);
    const hours: number = parseInt(str.slice(8, 10), 10);
    const minutes: number = parseInt(str.slice(10, 12), 10);
    const seconds: number = parseInt(str.slice(12, 14), 10);
    validateDateTime("DATE-TIME", year, month, day, hours, minutes, seconds);
    return new Date(year, month, day, hours, minutes, seconds);
}
