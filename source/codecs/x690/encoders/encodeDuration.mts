import type { DURATION, INTEGER, OPTIONAL, SingleThreadUint8Array } from "../../../macros.mjs";
import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";

export default
function encodeDuration (value: DURATION): SingleThreadUint8Array {
    if (value.weeks) {
        if (!value.fractional_part) {
            return convertTextToBytes(`${value.weeks}W`);
        } else {
            const integralAmount: INTEGER = value.weeks;
            const fractional_value: number = (typeof value.fractional_part.fractional_value === "bigint")
                ? Number(value.fractional_part.fractional_value)
                : value.fractional_part.fractional_value;
            const number_of_digits: number = (typeof value.fractional_part.number_of_digits === "bigint")
                ? Number(value.fractional_part.number_of_digits)
                : value.fractional_part.number_of_digits;
            const fraction: INTEGER = (fractional_value / Math.pow(10, number_of_digits));
            return convertTextToBytes(
                integralAmount.toString()
                + fraction.toString().slice(1) // slice(1) gets rid of the leading 0.
                + "W",
            );
        }
    }

    let years: OPTIONAL<number> = (typeof value.years === "bigint")
        ? Number(value.years)
        : value.years;
    let months: OPTIONAL<number> = (typeof value.months === "bigint")
        ? Number(value.months)
        : value.months;
    let days: OPTIONAL<number> = (typeof value.days === "bigint")
        ? Number(value.days)
        : value.days;
    let hours: OPTIONAL<number> = (typeof value.hours === "bigint")
        ? Number(value.hours)
        : value.hours;
    let minutes: OPTIONAL<number> = (typeof value.minutes === "bigint")
        ? Number(value.minutes)
        : value.minutes;
    let seconds: OPTIONAL<number> = (typeof value.seconds === "bigint")
        ? Number(value.seconds)
        : value.seconds;

    if (value.fractional_part) {
        const fractional_value: number = (typeof value.fractional_part.fractional_value === "bigint")
            ? Number(value.fractional_part.fractional_value)
            : value.fractional_part.fractional_value;
        const number_of_digits: number = (typeof value.fractional_part.number_of_digits === "bigint")
            ? Number(value.fractional_part.number_of_digits)
            : value.fractional_part.number_of_digits;
        const fraction: number = fractional_value / Math.pow(10, number_of_digits);
        if (seconds !== undefined) {
            seconds += fraction;
        } else if (minutes !== undefined) {
            minutes += fraction;
        } else if (hours !== undefined) {
            hours += fraction;
        } else if (days !== undefined) {
            days += fraction;
        } else if (months !== undefined) {
            months += fraction;
        } else if (years !== undefined) {
            years += fraction;
        }
    }

    return convertTextToBytes(
        (years ? `${years}Y` : "")
        + (months ? `${months}M` : "")
        + (days ? `${days}D` : "")
        + ((hours || minutes || seconds) ? "T" : "")
        + (hours ? `${hours}H` : "")
        + (minutes ? `${minutes}M` : "")
        + (seconds ? `${seconds}S` : ""),
    );
}
