import { strict as assert } from "node:assert";
import { Buffer } from "node:buffer";

function convertTextToBytes(text) {
    return new TextEncoder().encode(text);
}

function convertBytesToText(bytes) {
    if (bytes instanceof Buffer) {
        return bytes.toString("utf-8");
    }
    return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.length).toString("utf-8");
}

const numberRegex = "(?:0|[1-9]\\d*)(?:\\.\\d+)?";
const durationRegex = new RegExp(
    "^(?:(" + numberRegex + ")Y)?"
    + "(?:(" + numberRegex + ")M)?"
    + "(?:(" + numberRegex + ")D)?"
    + "(?:T"
    + "(?:(" + numberRegex + ")H)?"
    + "(?:(" + numberRegex + ")M)?"
    + "(?:(" + numberRegex + ")S)?"
    + ")?$",
);

function currentEncode(value) {
    if (value.weeks) {
        if (!value.fractional_part) {
            return convertTextToBytes(`${value.weeks}W`);
        }
        const fractional_value = Number(value.fractional_part.fractional_value);
        const number_of_digits = Number(value.fractional_part.number_of_digits);
        const fraction = fractional_value / Math.pow(10, number_of_digits);
        return convertTextToBytes(value.weeks.toString() + fraction.toString().slice(1) + "W");
    }
    let years = value.years;
    let months = value.months;
    let days = value.days;
    let hours = value.hours;
    let minutes = value.minutes;
    let seconds = value.seconds;
    if (value.fractional_part) {
        const fraction = Number(value.fractional_part.fractional_value)
            / Math.pow(10, Number(value.fractional_part.number_of_digits));
        if (seconds !== undefined) seconds += fraction;
        else if (minutes !== undefined) minutes += fraction;
        else if (hours !== undefined) hours += fraction;
        else if (days !== undefined) days += fraction;
        else if (months !== undefined) months += fraction;
        else if (years !== undefined) years += fraction;
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

function appendUnsigned(out, value) {
    const n = Math.floor(value);
    if (n >= 10) appendUnsigned(out, Math.floor(n / 10));
    out.push(0x30 + (n % 10));
}

function appendFraction(out, fractional_part) {
    const digits = Number(fractional_part.number_of_digits);
    const frac = Number(fractional_part.fractional_value);
    out.push(0x2E);
    let remaining = digits;
    let tmp = Math.floor(frac);
    if (tmp === 0) remaining--;
    else {
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

function appendComponent(out, value, unit, fractional_part) {
    if (fractional_part) {
        appendUnsigned(out, value ?? 0);
        appendFraction(out, fractional_part);
        out.push(unit);
        return;
    }
    if (!value) return;
    appendUnsigned(out, value);
    out.push(unit);
}

function bytesEncode(value) {
    if (value.weeks) {
        const out = [];
        appendUnsigned(out, value.weeks);
        if (value.fractional_part) appendFraction(out, value.fractional_part);
        out.push(0x57);
        return Uint8Array.from(out);
    }
    const { years, months, days, hours, minutes, seconds, fractional_part: frac } = value;
    const fracOnSeconds = Boolean(frac) && (seconds !== undefined);
    const fracOnMinutes = Boolean(frac) && !fracOnSeconds && (minutes !== undefined);
    const fracOnHours = Boolean(frac) && !fracOnSeconds && !fracOnMinutes && (hours !== undefined);
    const fracOnDays = Boolean(frac) && !fracOnSeconds && !fracOnMinutes && !fracOnHours && (days !== undefined);
    const fracOnMonths = Boolean(frac)
        && !fracOnSeconds && !fracOnMinutes && !fracOnHours && !fracOnDays
        && (months !== undefined);
    const fracOnYears = Boolean(frac)
        && !fracOnSeconds && !fracOnMinutes && !fracOnHours && !fracOnDays && !fracOnMonths
        && (years !== undefined);
    const out = [];
    appendComponent(out, years, 0x59, fracOnYears ? frac : undefined);
    appendComponent(out, months, 0x4D, fracOnMonths ? frac : undefined);
    appendComponent(out, days, 0x44, fracOnDays ? frac : undefined);
    if (hours || minutes || seconds || fracOnHours || fracOnMinutes || fracOnSeconds) {
        out.push(0x54);
    }
    appendComponent(out, hours, 0x48, fracOnHours ? frac : undefined);
    appendComponent(out, minutes, 0x4D, fracOnMinutes ? frac : undefined);
    appendComponent(out, seconds, 0x53, fracOnSeconds ? frac : undefined);
    return Uint8Array.from(out);
}

function currentDecode(bytes) {
    const str = convertBytesToText(bytes).replace(/,/g, ".");
    if (str.indexOf("W") === (str.length - 1)) {
        const weekString = str.slice(0, -1);
        const indexOfDecimalSeparator = weekString.indexOf(".");
        const weeks = indexOfDecimalSeparator !== -1
            ? parseInt(weekString.slice(0, indexOfDecimalSeparator), 10)
            : parseInt(weekString, 10);
        let fractional_part;
        if (indexOfDecimalSeparator !== -1) {
            const fractionString = weekString.slice(indexOfDecimalSeparator + 1);
            fractional_part = {
                number_of_digits: fractionString.length,
                fractional_value: parseInt(fractionString, 10),
            };
        }
        return { years: undefined, months: undefined, weeks, days: undefined,
            hours: undefined, minutes: undefined, seconds: undefined, fractional_part };
    }
    const match = durationRegex.exec(str);
    if (!match) throw new Error(`Malformed DURATION ${str}`);
    let fractional_part;
    for (const component of match.slice(1, 7)) {
        if (!component) continue;
        if (fractional_part) throw new Error("double fraction");
        const indexOfFractionalSeparator = component.indexOf(".");
        if (indexOfFractionalSeparator !== -1) {
            fractional_part = {
                number_of_digits: (component.length - 1 - indexOfFractionalSeparator),
                fractional_value: Number.parseInt(component.slice(indexOfFractionalSeparator + 1), 10),
            };
        }
    }
    return {
        years: match[1] ? Number.parseInt(match[1], 10) : undefined,
        months: match[2] ? Number.parseInt(match[2], 10) : undefined,
        weeks: undefined,
        days: match[3] ? Number.parseInt(match[3], 10) : undefined,
        hours: match[4] ? Number.parseInt(match[4], 10) : undefined,
        minutes: match[5] ? Number.parseInt(match[5], 10) : undefined,
        seconds: match[6] ? Number.parseInt(match[6], 10) : undefined,
        fractional_part,
    };
}

function parseNumber(bytes, i, allowComma) {
    const len = bytes.length;
    const first = bytes[i];
    let integer = 0;
    if (first === 0x30) {
        i++;
        if (i < len && bytes[i] >= 0x30 && bytes[i] <= 0x39) throw new Error("leading zero");
    } else if (first >= 0x31 && first <= 0x39) {
        while (i < len && bytes[i] >= 0x30 && bytes[i] <= 0x39) {
            integer = (integer * 10) + (bytes[i] - 0x30);
            i++;
        }
    } else {
        throw new Error("Malformed DURATION");
    }
    let fractional_part;
    const sep = (i < len) ? bytes[i] : undefined;
    if (sep === 0x2E || (sep === 0x2C && allowComma)) {
        i++;
        let fractional_value = 0;
        let number_of_digits = 0;
        while (i < len && bytes[i] >= 0x30 && bytes[i] <= 0x39) {
            fractional_value = (fractional_value * 10) + (bytes[i] - 0x30);
            number_of_digits++;
            i++;
        }
        if (number_of_digits === 0) throw new Error("Malformed DURATION");
        fractional_part = { number_of_digits, fractional_value };
    }
    return { integer, fractional_part, next: i };
}

function bytesDecode(bytes, allowComma = true) {
    if (bytes.length === 0) {
        return { years: undefined, months: undefined, weeks: undefined, days: undefined,
            hours: undefined, minutes: undefined, seconds: undefined, fractional_part: undefined };
    }
    if (bytes[bytes.length - 1] === 0x57) {
        const parsed = parseNumber(bytes, 0, allowComma);
        if (parsed.next !== bytes.length - 1) throw new Error("Malformed DURATION");
        return { years: undefined, months: undefined, weeks: parsed.integer, days: undefined,
            hours: undefined, minutes: undefined, seconds: undefined,
            fractional_part: parsed.fractional_part };
    }
    let i = 0;
    let seen = 0;
    let seenT = false;
    let sawFraction = false;
    const out = { years: undefined, months: undefined, weeks: undefined, days: undefined,
        hours: undefined, minutes: undefined, seconds: undefined, fractional_part: undefined };
    while (i < bytes.length) {
        if (bytes[i] === 0x54) {
            if (seenT || seen > 3) throw new Error("Malformed DURATION");
            seenT = true;
            seen = 4;
            i++;
            continue;
        }
        if (sawFraction) throw new Error("fraction not last");
        const parsed = parseNumber(bytes, i, allowComma);
        i = parsed.next;
        if (i >= bytes.length) throw new Error("Malformed DURATION");
        const unit = bytes[i++];
        if (parsed.fractional_part) {
            sawFraction = true;
            out.fractional_part = parsed.fractional_part;
        }
        switch (unit) {
        case 0x59:
            if (seenT || seen >= 1) throw new Error("order");
            out.years = parsed.integer; seen = 1; break;
        case 0x4D:
            if (seenT) {
                if (seen >= 6) throw new Error("order");
                out.minutes = parsed.integer; seen = 6;
            } else {
                if (seen >= 2) throw new Error("order");
                out.months = parsed.integer; seen = 2;
            }
            break;
        case 0x44:
            if (seenT || seen >= 3) throw new Error("order");
            out.days = parsed.integer; seen = 3; break;
        case 0x48:
            if (!seenT || seen >= 5) throw new Error("order");
            out.hours = parsed.integer; seen = 5; break;
        case 0x53:
            if (!seenT || seen >= 7) throw new Error("order");
            out.seconds = parsed.integer; seen = 7; break;
        default:
            throw new Error("unrecognized");
        }
    }
    return out;
}

function sameBytes(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
}

function sameDuration(a, b) {
    return a.years === b.years
        && a.months === b.months
        && a.weeks === b.weeks
        && a.days === b.days
        && a.hours === b.hours
        && a.minutes === b.minutes
        && a.seconds === b.seconds
        && JSON.stringify(a.fractional_part) === JSON.stringify(b.fractional_part);
}

const values = [
    { years: 2020, months: 3, days: 7, hours: 15, minutes: 58, seconds: 23 },
    { years: 2020, months: 3, days: 7, hours: 15, minutes: 58, seconds: 23,
        fractional_part: { number_of_digits: 3, fractional_value: 123 } },
    { weeks: 4 },
    { weeks: 4, fractional_part: { number_of_digits: 4, fractional_value: 5678 } },
    { years: 2020, months: 3, days: 7, minutes: 58, seconds: 23 },
    { years: 2020, months: 3, days: 7, minutes: 58,
        fractional_part: { number_of_digits: 3, fractional_value: 123 } },
    { hours: 1, minutes: 2, seconds: 3 },
    { days: 1 },
];

const encoded = [
    "2020Y3M7DT15H58M23S",
    "2020Y3M7DT15H58M23.123S",
    "4W",
    "4.5678W",
    "2020Y3M7DT58M23S",
    "2020Y3M7DT58.123M",
    "T1H2M3S",
    "1D",
    "T0.5S",
    "1Y",
].map((s) => Buffer.from(s, "ascii"));

console.log("Verifying encode/decode agreement...");
for (const value of values) {
    assert(sameBytes(bytesEncode(value), currentEncode(value)), `encode mismatch ${JSON.stringify(value)}`);
}
for (const input of encoded) {
    assert(sameDuration(bytesDecode(input), currentDecode(input)), `decode mismatch ${input}`);
}
assert.throws(() => bytesDecode(Buffer.from("1H2M3S")));
assert.throws(() => bytesDecode(Buffer.from("23S15M")));
assert.throws(() => bytesDecode(Buffer.from("1Q")));
assert.throws(() => bytesDecode(Buffer.from("1Y2.3M4D")));
console.log("All implementations agree.\n");

function bench(fn, items) {
    for (let i = 0; i < 20_000; i++) fn(items[i % items.length]);
    const n = 400_000;
    const t0 = performance.now();
    for (let i = 0; i < n; i++) fn(items[i % items.length]);
    return ((performance.now() - t0) / n) * 1e6;
}

function report(title, impls, items) {
    console.log(`=== ${title} ===`);
    const results = Object.entries(impls).map(([name, fn]) => [name, bench(fn, items)]);
    results.sort((a, b) => a[1] - b[1]);
    const base = results.find((r) => r[0] === "current")[1];
    for (const [name, ns] of results) {
        console.log(`${name.padEnd(18)} ${ns.toFixed(1).padStart(8)} ns/op  ${(base / ns).toFixed(2)}x`);
    }
    console.log();
}

report("encode DURATION", { current: currentEncode, bytes: bytesEncode }, values);
report("decode DURATION, Buffer", { current: currentDecode, bytes: bytesDecode }, encoded);
report(
    "decode DURATION, Uint8Array",
    { current: currentDecode, bytes: bytesDecode },
    encoded.map((b) => new Uint8Array(b)),
);
