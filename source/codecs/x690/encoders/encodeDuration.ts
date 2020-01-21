import { DURATION, INTEGER, OPTIONAL } from "../../../macros";
import convertTextToBytes from "../../../utils/convertTextToBytes";

export default
function encodeDuration (value: DURATION): Uint8Array {
    if (value.weeks) {
        if (!value.fractional_part) {
            return convertTextToBytes(`${value.weeks}W`);
        } else {
            const integralAmount: number = value.weeks;
            const fraction: number = value.fractional_part.fractional_value
                / Math.pow(10, value.fractional_part.number_of_digits);
            return convertTextToBytes(
                integralAmount.toString()
                + fraction.toString().slice(1) // slice(1) gets rid of the leading 0.
                + "W",
            );
        }
    }

    let years: OPTIONAL<INTEGER> = value.years;
    let months: OPTIONAL<INTEGER> = value.months;
    let days: OPTIONAL<INTEGER> = value.days;
    let hours: OPTIONAL<INTEGER> = value.hours;
    let minutes: OPTIONAL<INTEGER> = value.minutes;
    let seconds: OPTIONAL<INTEGER> = value.seconds;

    if (value.fractional_part) {
        const fraction: number = value.fractional_part.fractional_value
            / Math.pow(10, value.fractional_part.number_of_digits);
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
