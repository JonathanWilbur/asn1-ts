import { strict as assert } from "node:assert";

function convertBytesToText(bytes) {
    return new TextDecoder("utf-8").decode(bytes);
}

function convertTextToBytes(text) {
    return new TextEncoder().encode(text);
}

function currentEncodeUTC(value) {
    let year = value.getUTCFullYear().toString();
    year = year.substring(year.length - 2, year.length).padStart(2, "0");
    const month = (value.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = value.getUTCDate().toString().padStart(2, "0");
    const hour = value.getUTCHours().toString().padStart(2, "0");
    const minute = value.getUTCMinutes().toString().padStart(2, "0");
    const second = value.getUTCSeconds().toString().padStart(2, "0");
    return convertTextToBytes(`${year}${month}${day}${hour}${minute}${second}Z`);
}

function currentEncodeGT(value) {
    const year = value.getUTCFullYear().toString().padStart(4, "0");
    const month = (value.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = value.getUTCDate().toString().padStart(2, "0");
    const hour = value.getUTCHours().toString().padStart(2, "0");
    const minute = value.getUTCMinutes().toString().padStart(2, "0");
    const second = value.getUTCSeconds().toString().padStart(2, "0");
    return convertTextToBytes(`${year}${month}${day}${hour}${minute}${second}Z`);
}

function writeDec2(bytes, offset, value) {
    bytes[offset] = 0x30 + ((value / 10) | 0);
    bytes[offset + 1] = 0x30 + (value % 10);
}

function writeDec4(bytes, offset, value) {
    bytes[offset] = 0x30 + ((value / 1000) | 0);
    bytes[offset + 1] = 0x30 + (((value / 100) | 0) % 10);
    bytes[offset + 2] = 0x30 + (((value / 10) | 0) % 10);
    bytes[offset + 3] = 0x30 + (value % 10);
}

function bytesEncodeUTC(value) {
    const bytes = new Uint8Array(13);
    writeDec2(bytes, 0, value.getUTCFullYear() % 100);
    writeDec2(bytes, 2, value.getUTCMonth() + 1);
    writeDec2(bytes, 4, value.getUTCDate());
    writeDec2(bytes, 6, value.getUTCHours());
    writeDec2(bytes, 8, value.getUTCMinutes());
    writeDec2(bytes, 10, value.getUTCSeconds());
    bytes[12] = 0x5A;
    return bytes;
}

function bytesEncodeGT(value) {
    const bytes = new Uint8Array(15);
    writeDec4(bytes, 0, value.getUTCFullYear());
    writeDec2(bytes, 4, value.getUTCMonth() + 1);
    writeDec2(bytes, 6, value.getUTCDate());
    writeDec2(bytes, 8, value.getUTCHours());
    writeDec2(bytes, 10, value.getUTCMinutes());
    writeDec2(bytes, 12, value.getUTCSeconds());
    bytes[14] = 0x5A;
    return bytes;
}

function decodeDec2(bytes, offset) {
    return (bytes[offset] - 0x30) * 10 + (bytes[offset + 1] - 0x30);
}

function currentDecodeUTC(value) {
    const dateString = convertBytesToText(value);
    let year = Number(dateString.slice(0, 2));
    year = (year <= 49) ? (2000 + year) : (1900 + year);
    const month = Number(dateString.slice(2, 4)) - 1;
    const date = Number(dateString.slice(4, 6));
    const hours = Number(dateString.slice(6, 8));
    const minutes = Number(dateString.slice(8, 10));
    const seconds = Number(dateString.slice(10, 12));
    return Date.UTC(year, month, date, hours, minutes, seconds);
}

function bytesDecodeUTC(value) {
    let year = decodeDec2(value, 0);
    year = (year <= 49) ? (2000 + year) : (1900 + year);
    return Date.UTC(
        year,
        decodeDec2(value, 2) - 1,
        decodeDec2(value, 4),
        decodeDec2(value, 6),
        decodeDec2(value, 8),
        decodeDec2(value, 10),
    );
}

function currentDecodeGT(value) {
    const dateString = convertBytesToText(value);
    return Date.UTC(
        Number(dateString.slice(0, 4)),
        Number(dateString.slice(4, 6)) - 1,
        Number(dateString.slice(6, 8)),
        Number(dateString.slice(8, 10)),
        Number(dateString.slice(10, 12)),
        Number(dateString.slice(12, 14)),
    );
}

function bytesDecodeGT(value) {
    const year = (value[0] - 48) * 1000 + (value[1] - 48) * 100 + (value[2] - 48) * 10 + (value[3] - 48);
    return Date.UTC(
        year,
        decodeDec2(value, 4) - 1,
        decodeDec2(value, 6),
        decodeDec2(value, 8),
        decodeDec2(value, 10),
        decodeDec2(value, 12),
    );
}

function sameBytes(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
}

const dates = [
    new Date(Date.UTC(2020, 3, 7, 15, 58, 23)),
    new Date(Date.UTC(1999, 11, 31, 23, 59, 59)),
    new Date(Date.UTC(2000, 1, 29, 0, 0, 0)),
    new Date(Date.UTC(1970, 0, 1, 0, 0, 0)),
    new Date(Date.UTC(2018, 11, 31, 22, 33, 44)),
    new Date(Date.UTC(2023, 5, 28, 2, 6, 36)),
];

const utcBytes = dates.map(bytesEncodeUTC);
const gtBytes = dates.map(bytesEncodeGT);

console.log("Verifying encode/decode agreement...");
for (const date of dates) {
    assert(sameBytes(bytesEncodeUTC(date), currentEncodeUTC(date)), "UTCTime encode mismatch");
    assert(sameBytes(bytesEncodeGT(date), currentEncodeGT(date)), "GeneralizedTime encode mismatch");
}
for (const bytes of utcBytes) {
    assert.equal(bytesDecodeUTC(bytes), currentDecodeUTC(bytes));
}
for (const bytes of gtBytes) {
    assert.equal(bytesDecodeGT(bytes), currentDecodeGT(bytes));
}
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

report("encode UTCTime", { current: currentEncodeUTC, bytes: bytesEncodeUTC }, dates);
report("encode GeneralizedTime", { current: currentEncodeGT, bytes: bytesEncodeGT }, dates);
report("decode UTCTime (YYMMDDhhmmssZ)", { current: currentDecodeUTC, bytes: bytesDecodeUTC }, utcBytes);
report("decode GeneralizedTime (YYYYMMDDHHMMSSZ)", { current: currentDecodeGT, bytes: bytesDecodeGT }, gtBytes);
