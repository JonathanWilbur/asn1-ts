import { strict as assert } from "node:assert";
import { Buffer } from "node:buffer";

function convertBytesToText(bytes) {
    if (bytes instanceof Buffer) {
        return bytes.toString("utf-8");
    }
    return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.length).toString("utf-8");
}

function decodeDecimalDigit(byte, type) {
    const digit = byte - 0x30;
    if ((digit >>> 0) > 9) {
        throw new Error(`${type} can only contain digits. Encountered character code ${byte}.`);
    }
    return digit;
}

function dec2(bytes, i, type) {
    return decodeDecimalDigit(bytes[i], type) * 10 + decodeDecimalDigit(bytes[i + 1], type);
}

function currentDateTime(bytes) {
    const str = convertBytesToText(bytes);
    return [
        parseInt(str.slice(0, 4), 10),
        parseInt(str.slice(4, 6), 10) - 1,
        parseInt(str.slice(6, 8), 10),
        parseInt(str.slice(8, 10), 10),
        parseInt(str.slice(10, 12), 10),
        parseInt(str.slice(12, 14), 10),
    ];
}

function bytesDateTime(bytes) {
    if (bytes.length !== 14) {
        throw new Error("DATE-TIME must contain exactly 14 digits (YYYYMMDDHHMMSS).");
    }
    return [
        (
            decodeDecimalDigit(bytes[0], "DATE-TIME") * 1000
            + decodeDecimalDigit(bytes[1], "DATE-TIME") * 100
            + decodeDecimalDigit(bytes[2], "DATE-TIME") * 10
            + decodeDecimalDigit(bytes[3], "DATE-TIME")
        ),
        dec2(bytes, 4, "DATE-TIME") - 1,
        dec2(bytes, 6, "DATE-TIME"),
        dec2(bytes, 8, "DATE-TIME"),
        dec2(bytes, 10, "DATE-TIME"),
        dec2(bytes, 12, "DATE-TIME"),
    ];
}

function currentTimeOfDay(bytes) {
    const str = convertBytesToText(bytes);
    return [
        parseInt(str.slice(0, 2), 10),
        parseInt(str.slice(2, 4), 10),
        parseInt(str.slice(4, 6), 10),
    ];
}

function bytesTimeOfDay(bytes) {
    if (bytes.length !== 6) {
        throw new Error("TIME-OF-DAY must contain exactly 6 digits (HHMMSS).");
    }
    return [
        dec2(bytes, 0, "TIME-OF-DAY"),
        dec2(bytes, 2, "TIME-OF-DAY"),
        dec2(bytes, 4, "TIME-OF-DAY"),
    ];
}

function currentDateTimeFull(bytes) {
    const [year, month, day, hours, minutes, seconds] = currentDateTime(bytes);
    return new Date(year, month, day, hours, minutes, seconds);
}

function bytesDateTimeFull(bytes) {
    const [year, month, day, hours, minutes, seconds] = bytesDateTime(bytes);
    return new Date(year, month, day, hours, minutes, seconds);
}

function currentTimeOfDayFull(bytes) {
    const [hours, minutes, seconds] = currentTimeOfDay(bytes);
    const ret = new Date();
    ret.setHours(hours);
    ret.setMinutes(minutes);
    ret.setSeconds(seconds);
    return ret;
}

function bytesTimeOfDayFull(bytes) {
    const [hours, minutes, seconds] = bytesTimeOfDay(bytes);
    const ret = new Date();
    ret.setHours(hours);
    ret.setMinutes(minutes);
    ret.setSeconds(seconds);
    return ret;
}

const dateTimes = [
    "20200407155823",
    "19991231235959",
    "20000229000000",
    "15821015120000",
    "99991231000000",
    "19700101000000",
    "20240229120101",
    "20150704180030",
];
const timesOfDay = [
    "000000",
    "155823",
    "235959",
    "120000",
    "010203",
    "090000",
];

function toU8(s) {
    return Uint8Array.from(s, (c) => c.charCodeAt(0));
}

const dateTimeU8 = dateTimes.map(toU8);
const dateTimeBuf = dateTimes.map((s) => Buffer.from(s, "ascii"));
const timeU8 = timesOfDay.map(toU8);
const timeBuf = timesOfDay.map((s) => Buffer.from(s, "ascii"));

function same(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
}

console.log("Verifying parse agreement...");
for (const input of [...dateTimeU8, ...dateTimeBuf]) {
    assert(same(currentDateTime(input), bytesDateTime(input)));
    const cur = currentDateTimeFull(input);
    const next = bytesDateTimeFull(input);
    assert.equal(cur.getTime(), next.getTime());
}
for (const input of [...timeU8, ...timeBuf]) {
    assert(same(currentTimeOfDay(input), bytesTimeOfDay(input)));
}
assert.throws(() => bytesDateTime(Buffer.from("2020040715582")));
assert.throws(() => bytesDateTime(Buffer.from("2020040715582A")));
assert.throws(() => bytesTimeOfDay(Buffer.from("15582")));
assert.throws(() => bytesTimeOfDay(Buffer.from("15582A")));
console.log("All parse implementations agree.\n");

function bench(fn, values) {
    for (let i = 0; i < 20_000; i++) fn(values[i % values.length]);
    const n = 400_000;
    const t0 = performance.now();
    for (let i = 0; i < n; i++) fn(values[i % values.length]);
    const t1 = performance.now();
    return ((t1 - t0) / n) * 1e6;
}

function report(title, impls, values) {
    console.log(`=== ${title} ===`);
    const results = [];
    for (const [name, fn] of Object.entries(impls)) {
        results.push([name, bench(fn, values)]);
    }
    results.sort((a, b) => a[1] - b[1]);
    const base = results.find((r) => r[0] === "current")[1];
    for (const [name, ns] of results) {
        console.log(`${name.padEnd(18)} ${ns.toFixed(1).padStart(8)} ns/op  ${(base / ns).toFixed(2)}x`);
    }
    console.log();
}

report("DATE-TIME parse only, Uint8Array", { current: currentDateTime, bytes: bytesDateTime }, dateTimeU8);
report("DATE-TIME parse only, Buffer", { current: currentDateTime, bytes: bytesDateTime }, dateTimeBuf);
report("DATE-TIME full, Uint8Array", { current: currentDateTimeFull, bytes: bytesDateTimeFull }, dateTimeU8);
report("TIME-OF-DAY parse only, Uint8Array", { current: currentTimeOfDay, bytes: bytesTimeOfDay }, timeU8);
report("TIME-OF-DAY parse only, Buffer", { current: currentTimeOfDay, bytes: bytesTimeOfDay }, timeBuf);
report("TIME-OF-DAY full, Uint8Array", { current: currentTimeOfDayFull, bytes: bytesTimeOfDayFull }, timeU8);
