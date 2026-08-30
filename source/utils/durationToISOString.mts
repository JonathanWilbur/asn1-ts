import type { DURATION, INTEGER, OPTIONAL } from "../macros.mjs";

/**
 * @summary Convert a `DURATION` value to an ISO 8601 duration string
 * @description
 * Produces strings such as `P2020Y3M7DT15H58M23S`, `P4W`, and `PT1H`.
 * Zero and absent components are omitted. A fractional part is attached to the
 * smallest present component, padded to `number_of_digits`. An empty duration
 * is represented as `PT0S`.
 * @param {DURATION} value - The duration to stringify.
 * @returns {string} An ISO 8601 duration string.
 * @function
 */
export default
function durationToISOString (value: DURATION): string {
    const frac = value.fractional_part;
    const fractionString = frac
        ? `.${frac.fractional_value.toString().padStart(Number(frac.number_of_digits), "0")}`
        : "";
    const component = (
        componentValue: OPTIONAL<INTEGER>,
        unit: string,
        withFraction: boolean,
    ): string => {
        if (withFraction) {
            return `${componentValue ?? 0}${fractionString}${unit}`;
        }
        if (!componentValue) {
            return "";
        }
        return `${componentValue}${unit}`;
    };

    if (value.weeks) {
        return `P${component(value.weeks, "W", Boolean(frac))}`;
    }

    const secondsPresent = value.seconds !== undefined;
    const minutesPresent = value.minutes !== undefined;
    const hoursPresent = value.hours !== undefined;
    const daysPresent = value.days !== undefined;
    const monthsPresent = value.months !== undefined;
    const yearsPresent = value.years !== undefined;
    const fracOnSeconds = Boolean(frac) && secondsPresent;
    const fracOnMinutes = Boolean(frac) && !fracOnSeconds && minutesPresent;
    const fracOnHours = Boolean(frac) && !fracOnSeconds && !fracOnMinutes && hoursPresent;
    const fracOnDays = Boolean(frac) && !fracOnSeconds && !fracOnMinutes && !fracOnHours && daysPresent;
    const fracOnMonths = Boolean(frac)
        && !fracOnSeconds && !fracOnMinutes && !fracOnHours && !fracOnDays
        && monthsPresent;
    const fracOnYears = Boolean(frac)
        && !fracOnSeconds && !fracOnMinutes && !fracOnHours && !fracOnDays && !fracOnMonths
        && yearsPresent;

    const date = component(value.years, "Y", fracOnYears)
        + component(value.months, "M", fracOnMonths)
        + component(value.days, "D", fracOnDays);
    const time = component(value.hours, "H", fracOnHours)
        + component(value.minutes, "M", fracOnMinutes)
        + component(value.seconds, "S", fracOnSeconds);
    if (!date && !time) {
        return "PT0S";
    }
    return time ? `P${date}T${time}` : `P${date}`;
}
