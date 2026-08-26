import type { DURATION, INTEGER, OPTIONAL, SingleThreadUint8Array } from "../../../macros.mjs";

function toNumber (value: INTEGER | undefined): number | undefined {
    if (value === undefined) {
        return undefined;
    }
    return (typeof value === "bigint") ? Number(value) : value;
}

function appendUnsigned (out: number[], value: number): void {
    const n: number = Math.floor(value);
    if (n >= 10) {
        appendUnsigned(out, Math.floor(n / 10));
    }
    out.push(0x30 + (n % 10));
}

function appendFraction (
    out: number[],
    fractional_part: { number_of_digits: INTEGER; fractional_value: INTEGER },
): void {
    const digits: number = Number(fractional_part.number_of_digits);
    const frac: number = Number(fractional_part.fractional_value);
    out.push(0x2E);
    let remaining: number = digits;
    let tmp: number = Math.floor(frac);
    if (tmp === 0) {
        remaining--;
    } else {
        while (tmp > 0) {
            remaining--;
            tmp = Math.floor(tmp / 10);
        }
    }
    while (remaining > 0) {
        out.push(0x30);
        remaining--;
    }
    appendUnsigned(out, frac);
}

function appendComponent (
    out: number[],
    value: number | undefined,
    unit: number,
    fractional_part: OPTIONAL<{ number_of_digits: INTEGER; fractional_value: INTEGER }>,
): void {
    if (fractional_part) {
        appendUnsigned(out, value ?? 0);
        appendFraction(out, fractional_part);
        out.push(unit);
        return;
    }
    if (!value) {
        return;
    }
    appendUnsigned(out, value);
    out.push(unit);
}

export default
function encodeDuration (value: DURATION): SingleThreadUint8Array {
    const weeks: number | undefined = toNumber(value.weeks);
    if (weeks) {
        const out: number[] = [];
        appendUnsigned(out, weeks);
        if (value.fractional_part) {
            appendFraction(out, value.fractional_part);
        }
        out.push(0x57);
        return Uint8Array.from(out);
    }

    const years: number | undefined = toNumber(value.years);
    const months: number | undefined = toNumber(value.months);
    const days: number | undefined = toNumber(value.days);
    const hours: number | undefined = toNumber(value.hours);
    const minutes: number | undefined = toNumber(value.minutes);
    const seconds: number | undefined = toNumber(value.seconds);
    const frac = value.fractional_part;
    const fracOnSeconds: boolean = Boolean(frac) && (seconds !== undefined);
    const fracOnMinutes: boolean = Boolean(frac) && !fracOnSeconds && (minutes !== undefined);
    const fracOnHours: boolean = Boolean(frac) && !fracOnSeconds && !fracOnMinutes && (hours !== undefined);
    const fracOnDays: boolean = Boolean(frac) && !fracOnSeconds && !fracOnMinutes && !fracOnHours && (days !== undefined);
    const fracOnMonths: boolean = Boolean(frac)
        && !fracOnSeconds && !fracOnMinutes && !fracOnHours && !fracOnDays
        && (months !== undefined);
    const fracOnYears: boolean = Boolean(frac)
        && !fracOnSeconds && !fracOnMinutes && !fracOnHours && !fracOnDays && !fracOnMonths
        && (years !== undefined);

    const out: number[] = [];
    appendComponent(out, years, 0x59, fracOnYears ? frac : undefined);
    appendComponent(out, months, 0x4D, fracOnMonths ? frac : undefined);
    appendComponent(out, days, 0x44, fracOnDays ? frac : undefined);
    if (
        hours
        || minutes
        || seconds
        || fracOnHours
        || fracOnMinutes
        || fracOnSeconds
    ) {
        out.push(0x54);
    }
    appendComponent(out, hours, 0x48, fracOnHours ? frac : undefined);
    appendComponent(out, minutes, 0x4D, fracOnMinutes ? frac : undefined);
    appendComponent(out, seconds, 0x53, fracOnSeconds ? frac : undefined);
    return Uint8Array.from(out);
}
