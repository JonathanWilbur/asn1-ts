import type { DURATION, INTEGER, OPTIONAL } from "../../../macros.mjs";
import * as errors from "../../../errors.mjs";
import { DURATION_EQUIVALENT } from "../../../types/index.mjs";

interface ParsedNumber {
    integer: number;
    fractional_part: OPTIONAL<{
        number_of_digits: number;
        fractional_value: number;
    }>;
    next: number;
}

function parseNumber (bytes: Uint8Array, i: number, canonical: boolean): ParsedNumber {
    const len: number = bytes.length;
    if (i >= len) {
        throw new errors.ASN1Error("Malformed DURATION.");
    }
    const first: number = bytes[i];
    let integer: number = 0;
    if (first === 0x30) {
        i++;
        if (i < len && bytes[i] >= 0x30 && bytes[i] <= 0x39) {
            throw new errors.ASN1Error("Malformed DURATION.");
        }
    } else if (first >= 0x31 && first <= 0x39) {
        while (i < len && bytes[i] >= 0x30 && bytes[i] <= 0x39) {
            integer = (integer * 10) + (bytes[i] - 0x30);
            i++;
        }
    } else {
        throw new errors.ASN1Error("Malformed DURATION.");
    }

    let fractional_part: ParsedNumber["fractional_part"] = undefined;
    const sep: number | undefined = (i < len) ? bytes[i] : undefined;
    if (sep === 0x2E || (sep === 0x2C && !canonical)) {
        i++;
        let fractional_value: number = 0;
        let number_of_digits: number = 0;
        while (i < len && bytes[i] >= 0x30 && bytes[i] <= 0x39) {
            fractional_value = (fractional_value * 10) + (bytes[i] - 0x30);
            number_of_digits++;
            i++;
        }
        if (number_of_digits === 0) {
            throw new errors.ASN1Error("Malformed DURATION.");
        }
        fractional_part = { number_of_digits, fractional_value };
    }

    return { integer, fractional_part, next: i };
}

function isZeroComponent (parsed: ParsedNumber): boolean {
    return parsed.integer === 0
        && (!parsed.fractional_part || parsed.fractional_part.fractional_value === 0);
}

function rejectZeroComponent (parsed: ParsedNumber, canonical: boolean): void {
    if (canonical && isZeroComponent(parsed)) {
        throw new errors.ASN1Error(
            "Zeroed components must be absent from DURATION when using the Distinguished or Canonical Encoding Rules.",
        );
    }
}

function decodeWeeks (bytes: Uint8Array, canonical: boolean): DURATION {
    const parsed: ParsedNumber = parseNumber(bytes, 0, canonical);
    if (parsed.next !== (bytes.length - 1)) {
        throw new errors.ASN1Error("Malformed DURATION.");
    }
    rejectZeroComponent(parsed, canonical);
    return new DURATION_EQUIVALENT(
        undefined,
        undefined,
        parsed.integer,
        undefined,
        undefined,
        undefined,
        undefined,
        parsed.fractional_part,
    );
}

/**
 * @param bytes - ISO 8601 duration bytes without a leading `P`.
 * @param canonical - DER/CER: no comma decimal separator, and zeroed components must be absent.
 */
export default
function decodeDuration (bytes: Uint8Array, canonical: boolean = false): DURATION {
    if (canonical) {
        for (let i: number = 0; i < bytes.length; i++) {
            if (bytes[i] === 0x2C) {
                throw new errors.ASN1Error(
                    "Comma prohibited in DURATION when using the Distinguished or Canonical Encoding Rules.",
                );
            }
        }
    }
    if (bytes.length === 0) {
        return new DURATION_EQUIVALENT(
            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        );
    }
    if (bytes[bytes.length - 1] === 0x57) {
        return decodeWeeks(bytes, canonical);
    }

    let i: number = 0;
    let seen: number = 0;
    let seenT: boolean = false;
    let sawFraction: boolean = false;
    let years: OPTIONAL<INTEGER> = undefined;
    let months: OPTIONAL<INTEGER> = undefined;
    let days: OPTIONAL<INTEGER> = undefined;
    let hours: OPTIONAL<INTEGER> = undefined;
    let minutes: OPTIONAL<INTEGER> = undefined;
    let seconds: OPTIONAL<INTEGER> = undefined;
    let fractional_part: OPTIONAL<{
        number_of_digits: INTEGER;
        fractional_value: INTEGER;
    }> = undefined;

    while (i < bytes.length) {
        if (bytes[i] === 0x54) {
            if (seenT || seen > 3) {
                throw new errors.ASN1Error("Malformed DURATION.");
            }
            seenT = true;
            seen = 4;
            i++;
            continue;
        }
        if (sawFraction) {
            throw new errors.ASN1Error(
                "No smaller components permitted after fractional component in DURATION.",
            );
        }
        const parsed: ParsedNumber = parseNumber(bytes, i, canonical);
        i = parsed.next;
        if (i >= bytes.length) {
            throw new errors.ASN1Error("Malformed DURATION.");
        }
        rejectZeroComponent(parsed, canonical);
        const unit: number = bytes[i++];
        if (parsed.fractional_part) {
            sawFraction = true;
            fractional_part = parsed.fractional_part;
        }
        switch (unit) {
        case 0x59: { // Y
            if (seenT || seen >= 1) {
                throw new errors.ASN1Error("Malformed DURATION.");
            }
            years = parsed.integer;
            seen = 1;
            break;
        }
        case 0x4D: { // M
            if (seenT) {
                if (seen >= 6) {
                    throw new errors.ASN1Error("Malformed DURATION.");
                }
                minutes = parsed.integer;
                seen = 6;
            } else {
                if (seen >= 2) {
                    throw new errors.ASN1Error("Malformed DURATION.");
                }
                months = parsed.integer;
                seen = 2;
            }
            break;
        }
        case 0x44: { // D
            if (seenT || seen >= 3) {
                throw new errors.ASN1Error("Malformed DURATION.");
            }
            days = parsed.integer;
            seen = 3;
            break;
        }
        case 0x48: { // H
            if (!seenT || seen >= 5) {
                throw new errors.ASN1Error("Malformed DURATION.");
            }
            hours = parsed.integer;
            seen = 5;
            break;
        }
        case 0x53: { // S
            if (!seenT || seen >= 7) {
                throw new errors.ASN1Error("Malformed DURATION.");
            }
            seconds = parsed.integer;
            seen = 7;
            break;
        }
        default: {
            throw new errors.ASN1Error("Malformed DURATION.");
        }
        }
    }

    return new DURATION_EQUIVALENT(
        years, months, undefined, days, hours, minutes, seconds, fractional_part,
    );
}
