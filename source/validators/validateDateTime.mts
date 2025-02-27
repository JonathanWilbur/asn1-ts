import validateDate from "./validateDate.mjs";
import validateTime from "./validateTime.mjs";

// eslint-disable-next-line
export default function validateDateTime (
    dataType: string,
    year: number,
    month: number,
    date: number,
    hours: number,
    minutes: number,
    seconds: number,
): void {
    validateDate(dataType, year, month, date);
    validateTime(dataType, hours, minutes, seconds);
}
