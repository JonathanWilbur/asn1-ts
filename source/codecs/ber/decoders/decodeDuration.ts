import { DURATION, INTEGER, OPTIONAL } from "../../../macros";
import convertBytesToText from "../../../utils/convertBytesToText";
import * as errors from "../../../errors";
import { DURATION_EQUIVALENT } from "../../../types";
import { datetimeRegex } from "../../../values";

export default
function decodeDuration (bytes: Uint8Array): DURATION {
    const str: string = convertBytesToText(bytes).replace(/,/g, ".");

    // If there is a W, it is a weeks designation.
    if (str.indexOf("W") === (str.length - 1)) {
        const weekString: string = str.slice(0, -1);
        const indexOfDecimalSeparator: number = weekString.indexOf(".");
        const weeks: number = indexOfDecimalSeparator !== -1
            ? parseInt(weekString.slice(0, indexOfDecimalSeparator), 10)
            : parseInt(weekString, 10);
        if (Number.isNaN(weeks)) {
            throw new errors.ASN1Error(`Could not decode a real number of weeks from DURATION ${str}.`);
        }
        let fractional_part: { number_of_digits: number; fractional_value: number } | undefined = undefined;
        if (indexOfDecimalSeparator !== -1) {
            const fractionString: string = weekString.slice(indexOfDecimalSeparator + 1);
            const fractionValue: number = parseInt(fractionString, 10);
            if (Number.isNaN(fractionValue)) {
                throw new errors.ASN1Error(`Could not decode a fractional number of weeks from DURATION ${str}.`);
            }
            fractional_part = {
                number_of_digits: fractionString.length,
                fractional_value: fractionValue,
            };
        }
        return new DURATION_EQUIVALENT(
            undefined,
            undefined,
            weeks,
            undefined,
            undefined,
            undefined,
            undefined,
            fractional_part,
        );
    }

    /**
     * I don't like the idea of using regular expressions for this, but it was
     * the best solution that ensures correct ordering of DURATION components.
     */
    const match: RegExpExecArray | null = datetimeRegex.exec(str);
    if (!match) {
        throw new errors.ASN1Error(`Malformed DURATION ${str}.`);
    }

    let fractional_part: OPTIONAL<{
        number_of_digits: INTEGER;
        fractional_value: INTEGER;
    }> = undefined;

    // This sets the fractional component and checks that it is not double-set.
    [
        match[1],
        match[2],
        match[3],
        match[4],
        match[5],
        match[6],
    ].forEach((component: string): void => {
        if (!component) {
            return;
        }
        if (fractional_part) {
            throw new errors.ASN1Error(
                `No smaller components permitted after fractional component in DURATION ${str}.`,
            );
        }
        const indexOfFractionalSeparator: number = component.indexOf(".");
        if (indexOfFractionalSeparator !== -1) { // It is a real number.
            fractional_part = {
                number_of_digits: (component.length - 1 - indexOfFractionalSeparator),
                fractional_value: Number.parseInt(component.slice(indexOfFractionalSeparator + 1), 10),
            };
        }
    });

    const years: OPTIONAL<INTEGER> = match[1] ? Number.parseInt(match[1], 10) : undefined;
    const months: OPTIONAL<INTEGER> = match[2] ? Number.parseInt(match[2], 10) : undefined;
    const days: OPTIONAL<INTEGER> = match[3] ? Number.parseInt(match[3], 10) : undefined;
    const hours: OPTIONAL<INTEGER> = match[4] ? Number.parseInt(match[4], 10) : undefined;
    const minutes: OPTIONAL<INTEGER> = match[5] ? Number.parseInt(match[5], 10) : undefined;
    const seconds: OPTIONAL<INTEGER> = match[6] ? Number.parseInt(match[6], 10) : undefined;
    return new DURATION_EQUIVALENT(years, months, undefined, days, hours, minutes, seconds, fractional_part);
}
