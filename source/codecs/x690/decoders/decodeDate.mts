import { DATE } from "../../../macros.mjs";
import convertBytesToText from "../../../utils/convertBytesToText.mjs";
import validateDate from "../../../validators/validateDate.mjs";

export default
function decodeDate (bytes: Uint8Array): DATE {
    const str: string = convertBytesToText(bytes);
    const year: number = parseInt(str.slice(0, 4), 10);
    const month: number = parseInt(str.slice(4, 6), 10) - 1;
    const day: number = parseInt(str.slice(6, 8), 10);
    validateDate("DATE", year, month, day);
    return new Date(year, month, day);
}
