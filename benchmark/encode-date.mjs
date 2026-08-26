import { strict as assert } from "node:assert";
import { Buffer } from "node:buffer";

function convertTextToBytes(text) {
    return new TextEncoder().encode(text);
}

function current(date) {
    const year = date.getFullYear();
    if (year < 1582 || year > 9999) {
        throw new Error("year out of range");
    }
    return convertTextToBytes(
        year.toString().padStart(4, "0")
        + (date.getMonth() + 1).toString().padStart(2, "0")
        + date.getDate().toString().padStart(2, "0"),
    );
}

function latin1(date) {
    const year = date.getFullYear();
    if (year < 1582 || year > 9999) {
        throw new Error("year out of range");
    }
    return Buffer.from(
        year.toString().padStart(4, "0")
        + (date.getMonth() + 1).toString().padStart(2, "0")
        + date.getDate().toString().padStart(2, "0"),
        "latin1",
    );
}

function bytes(date) {
    const year = date.getFullYear();
    if (year < 1582 || year > 9999) {
        throw new Error("year out of range");
    }
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const out = new Uint8Array(8);
    out[0] = 0x30 + ((year / 1000) | 0);
    out[1] = 0x30 + (((year / 100) | 0) % 10);
    out[2] = 0x30 + (((year / 10) | 0) % 10);
    out[3] = 0x30 + (year % 10);
    out[4] = 0x30 + ((month / 10) | 0);
    out[5] = 0x30 + (month % 10);
    out[6] = 0x30 + ((day / 10) | 0);
    out[7] = 0x30 + (day % 10);
    return out;
}

const dates = [
    new Date(2020, 3, 7),
    new Date(1999, 11, 31),
    new Date(2000, 1, 29),
    new Date(1582, 9, 15),
    new Date(9999, 11, 31),
    new Date(1970, 0, 1),
    new Date(2024, 1, 29),
    new Date(2015, 6, 4),
];

function sameBytes(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

console.log("Verifying encode agreement...");
for (const date of dates) {
    const expected = current(date);
    assert(sameBytes(latin1(date), expected), "latin1 mismatch");
    assert(sameBytes(bytes(date), expected), "bytes mismatch");
}
assert.throws(() => bytes(new Date(1500, 0, 1)));
assert.throws(() => bytes(new Date(10000, 0, 1)));
console.log("All encode implementations agree.\n");

function bench(fn, values) {
    for (let i = 0; i < 20_000; i++) fn(values[i % values.length]);
    const n = 400_000;
    const t0 = performance.now();
    for (let i = 0; i < n; i++) fn(values[i % values.length]);
    const t1 = performance.now();
    return ((t1 - t0) / n) * 1e6;
}

const impls = { current, latin1, bytes };
console.log("=== encode DATE ===");
const results = [];
for (const [name, fn] of Object.entries(impls)) {
    results.push([name, bench(fn, dates)]);
}
results.sort((a, b) => a[1] - b[1]);
const base = results.find((r) => r[0] === "current")[1];
for (const [name, ns] of results) {
    console.log(`${name.padEnd(18)} ${ns.toFixed(1).padStart(8)} ns/op  ${(base / ns).toFixed(2)}x`);
}
