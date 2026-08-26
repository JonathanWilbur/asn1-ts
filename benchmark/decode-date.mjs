import { strict as assert } from "node:assert";
import { Buffer } from "node:buffer";

function convertBytesToText(bytes, codec = "utf-8") {
    if (bytes instanceof Buffer) {
        return bytes.toString(codec);
    }
    return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.length).toString(codec);
}

function validateDate(dataType, year, month, date) {
    if (!Number.isSafeInteger(year)) {
        throw new Error(`Invalid year in ${dataType}`);
    }
    if (!Number.isSafeInteger(month)) {
        throw new Error(`Invalid month in ${dataType}`);
    }
    if (!Number.isSafeInteger(date) || (date < 1)) {
        throw new Error(`Invalid day in ${dataType}`);
    }
    switch (month) {
    case 0: case 2: case 4: case 6: case 7: case 9: case 11: {
        if (date > 31) throw new Error(`Day > 31 in ${dataType}`);
        break;
    }
    case 3: case 5: case 8: case 10: {
        if (date > 30) throw new Error(`Day > 30 in ${dataType}`);
        break;
    }
    case 1: {
        const isLeapYear = ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
        if (isLeapYear) {
            if (date > 29) throw new Error(`Day > 29 in ${dataType} leap February`);
        } else if (date > 28) {
            throw new Error(`Day > 28 in ${dataType} non-leap February`);
        }
        break;
    }
    default:
        throw new Error(`Invalid month in ${dataType}`);
    }
}

function currentParse(bytes) {
    const str = convertBytesToText(bytes);
    return [
        parseInt(str.slice(0, 4), 10),
        parseInt(str.slice(4, 6), 10) - 1,
        parseInt(str.slice(6, 8), 10),
    ];
}

function latin1Parse(bytes) {
    const str = convertBytesToText(bytes, "latin1");
    return [
        parseInt(str.slice(0, 4), 10),
        parseInt(str.slice(4, 6), 10) - 1,
        parseInt(str.slice(6, 8), 10),
    ];
}

function asciiParse(bytes) {
    const str = convertBytesToText(bytes, "ascii");
    return [
        parseInt(str.slice(0, 4), 10),
        parseInt(str.slice(4, 6), 10) - 1,
        parseInt(str.slice(6, 8), 10),
    ];
}

function decodeDecimalDigit(byte) {
    const digit = byte - 0x30;
    if ((digit >>> 0) > 9) {
        throw new Error(`DATE can only contain digits. Encountered character code ${byte}.`);
    }
    return digit;
}

function bytesParse(bytes) {
    if (bytes.length !== 8) {
        throw new Error("DATE must contain exactly 8 digits (YYYYMMDD).");
    }
    return [
        (
            decodeDecimalDigit(bytes[0]) * 1000
            + decodeDecimalDigit(bytes[1]) * 100
            + decodeDecimalDigit(bytes[2]) * 10
            + decodeDecimalDigit(bytes[3])
        ),
        decodeDecimalDigit(bytes[4]) * 10 + decodeDecimalDigit(bytes[5]) - 1,
        decodeDecimalDigit(bytes[6]) * 10 + decodeDecimalDigit(bytes[7]),
    ];
}

function currentFull(bytes) {
    const [year, month, day] = currentParse(bytes);
    validateDate("DATE", year, month, day);
    return new Date(year, month, day);
}

function bytesFull(bytes) {
    const [year, month, day] = bytesParse(bytes);
    validateDate("DATE", year, month, day);
    return new Date(year, month, day);
}

const dates = [
    "20200407",
    "19991231",
    "20000229",
    "15821015",
    "99991231",
    "19700101",
    "20240229",
    "20150704",
];

const asUint8 = dates.map((s) => Uint8Array.from(s, (c) => c.charCodeAt(0)));
const asBuffer = dates.map((s) => Buffer.from(s, "ascii"));

function sameYmd(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

console.log("Verifying parse agreement...");
for (const input of [...asUint8, ...asBuffer]) {
    const cur = currentParse(input);
    assert(sameYmd(cur, latin1Parse(input)), "latin1 mismatch");
    assert(sameYmd(cur, asciiParse(input)), "ascii mismatch");
    assert(sameYmd(cur, bytesParse(input)), "bytes mismatch");
    const full = currentFull(input);
    const bytes = bytesFull(input);
    assert.equal(full.getFullYear(), bytes.getFullYear());
    assert.equal(full.getMonth(), bytes.getMonth());
    assert.equal(full.getDate(), bytes.getDate());
}
assert.throws(() => bytesFull(Buffer.from("20201301")));
assert.throws(() => bytesParse(Buffer.from("2020040")));
assert.throws(() => bytesParse(Buffer.from("202004070")));
assert.throws(() => bytesParse(Buffer.from("2020A407")));
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

const parseImpls = {
    current: currentParse,
    latin1: latin1Parse,
    ascii: asciiParse,
    bytes: bytesParse,
};

const fullImpls = {
    current: currentFull,
    bytes: bytesFull,
};

report("parse only, Uint8Array", parseImpls, asUint8);
report("parse only, Buffer", parseImpls, asBuffer);
report("full decode (validate + Date), Uint8Array", fullImpls, asUint8);
report("full decode (validate + Date), Buffer", fullImpls, asBuffer);
