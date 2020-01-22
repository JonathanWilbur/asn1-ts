import { DURATION, INTEGER, OPTIONAL } from "../../../macros";
import convertBytesToText from "../../../utils/convertBytesToText";
import * as errors from "../../../errors";
import { DURATION_EQUIVALENT } from "../../../types";
import { datetimeRegex } from "../../../values";

export default
function decodeDuration (bytes: Uint8Array): DURATION {
    const str: string = convertBytesToText(bytes);
    if (str.indexOf(",") !== -1) {
        throw new errors.ASN1Error(
            "Comma prohibited in DURATION when using the Distinguished or Canonical Encoding Rules.",
        );
    }

    // If there is a W, it is a weeks designation.
    if (str.indexOf("W") === (str.length - 1)) {
        const weeks: number = parseFloat(str.slice(0, -1));
        if (Number.isNaN(weeks)) {
            throw new errors.ASN1Error(`Could not decode a real number of weeks from duration ${str}.`);
        }
        return new DURATION_EQUIVALENT(
            undefined,
            undefined,
            weeks,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
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
        const indexOfFractionalSeparator: number = component.indexOf(".");
        if (indexOfFractionalSeparator !== -1) { // It is a real number.
            if (fractional_part) {
                throw new errors.ASN1Error(
                    `Multiple fractional components defined in DURATION ${str}.`,
                );
            }
            fractional_part = {
                number_of_digits: (component.length - 1 - indexOfFractionalSeparator),
                fractional_value: Number.parseInt(component.slice(indexOfFractionalSeparator + 1), 10),
            };
        }
    });

    // Even though we are using parseFloat, we have already ensured that only one of these will be a float.
    return new DURATION_EQUIVALENT(
        Number.parseInt(match[1], 10),
        Number.parseInt(match[2], 10),
        undefined,
        Number.parseInt(match[3], 10),
        Number.parseInt(match[4], 10),
        Number.parseInt(match[5], 10),
        Number.parseInt(match[6], 10),
        fractional_part,
    );
}
