import { strict as assert } from "node:assert";
import { Buffer } from "node:buffer";

function convertTextToBytes(text) {
    return new TextEncoder().encode(text);
}

function pad2(n) {
    return n.toString().padStart(2, "0");
}

function currentDateTime(value) {
    const year = value.getFullYear();
    if (year < 1582 || year > 9999) {
        throw new Error("year out of range");
    }
    return convertTextToBytes(
        year.toString().padStart(4, "0")
        + pad2(value.getMonth() + 1)
        + pad2(value.getDate())
        + pad2(value.getHours())
        + pad2(value.getMinutes())
        + pad2(value.getSeconds()),
    );
}

function bytesDateTime(value) {
    const year = value.getFullYear();
    if (year < 1582 || year > 9999) {
        throw new Error("year out of range");
    }
    const month = value.getMonth() + 1;
    const day = value.getDate();
    const hours = value.getHours();
    const minutes = value.getMinutes();
    const seconds = value.getSeconds();
    const out = new Uint8Array(14);
    out[0] = 0x30 + ((year / 1000) | 0);
    out[1] = 0x30 + (((year / 100) | 0) % 10);
    out[2] = 0x30 + (((year / 10) | 0) % 10);
    out[3] = 0x30 + (year % 10);
    out[4] = 0x30 + ((month / 10) | 0);
    out[5] = 0x30 + (month % 10);
    out[6] = 0x30 + ((day / 10) | 0);
    out[7] = 0x30 + (day % 10);
    out[8] = 0x30 + ((hours / 10) | 0);
    out[9] = 0x30 + (hours % 10);
    out[10] = 0x30 + ((minutes / 10) | 0);
    out[11] = 0x30 + (minutes % 10);
    out[12] = 0x30 + ((seconds / 10) | 0);
    out[13] = 0x30 + (seconds % 10);
    return out;
}

function currentTimeOfDay(time) {
    return convertTextToBytes(
        pad2(time.getHours())
        + pad2(time.getMinutes())
        + pad2(time.getSeconds()),
    );
}

function bytesTimeOfDay(time) {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const out = new Uint8Array(6);
    out[0] = 0x30 + ((hours / 10) | 0);
    out[1] = 0x30 + (hours % 10);
    out[2] = 0x30 + ((minutes / 10) | 0);
    out[3] = 0x30 + (minutes % 10);
    out[4] = 0x30 + ((seconds / 10) | 0);
    out[5] = 0x30 + (seconds % 10);
    return out;
}

const values = [
    new Date(2020, 3, 7, 15, 58, 23),
    new Date(1999, 11, 31, 23, 59, 59),
    new Date(2000, 1, 29, 0, 0, 0),
    new Date(1582, 9, 15, 12, 0, 0),
    new Date(9999, 11, 31, 0, 0, 0),
    new Date(1970, 0, 1, 0, 0, 0),
    new Date(2024, 1, 29, 12, 1, 1),
    new Date(2015, 6, 4, 18, 0, 30),
];

function sameBytes(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

console.log("Verifying encode agreement...");
for (const value of values) {
    assert(sameBytes(bytesDateTime(value), currentDateTime(value)), "DATE-TIME mismatch");
    assert(sameBytes(bytesTimeOfDay(value), currentTimeOfDay(value)), "TIME-OF-DAY mismatch");
}
assert.throws(() => bytesDateTime(new Date(1500, 0, 1)));
assert.throws(() => bytesDateTime(new Date(10000, 0, 1)));
console.log("All encode implementations agree.\n");

function bench(fn, items) {
    for (let i = 0; i < 20_000; i++) fn(items[i % items.length]);
    const n = 400_000;
    const t0 = performance.now();
    for (let i = 0; i < n; i++) fn(items[i % items.length]);
    const t1 = performance.now();
    return ((t1 - t0) / n) * 1e6;
}

function report(title, impls, items) {
    console.log(`=== ${title} ===`);
    const results = [];
    for (const [name, fn] of Object.entries(impls)) {
        results.push([name, bench(fn, items)]);
    }
    results.sort((a, b) => a[1] - b[1]);
    const base = results.find((r) => r[0] === "current")[1];
    for (const [name, ns] of results) {
        console.log(`${name.padEnd(18)} ${ns.toFixed(1).padStart(8)} ns/op  ${(base / ns).toFixed(2)}x`);
    }
    console.log();
}

report("encode DATE-TIME", { current: currentDateTime, bytes: bytesDateTime }, values);
report("encode TIME-OF-DAY", { current: currentTimeOfDay, bytes: bytesTimeOfDay }, values);
