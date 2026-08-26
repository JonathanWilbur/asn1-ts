/**
 * Benchmark DERElement.fromBytes.
 * Run: node benchmark/from-bytes.mjs
 */
import DERElement from "../dist/codecs/der.mjs";

function makeCases() {
    const smallPayload = new Uint8Array(16).fill(0x41);
    const mediumPayload = new Uint8Array(256).fill(0x42);
    const largePayload = new Uint8Array(4096).fill(0x43);

    function wrap(tag, lengthForm, payload) {
        const out = new Uint8Array(1 + lengthForm.length + payload.length);
        out[0] = tag;
        out.set(lengthForm, 1);
        out.set(payload, 1 + lengthForm.length);
        return out;
    }

    return {
        "boolean true": new Uint8Array([0x01, 0x01, 0xFF]),
        "integer small": new Uint8Array([0x02, 0x01, 0x2A]),
        "octet short": wrap(0x04, [0x10], smallPayload),
        "octet medium": wrap(0x04, [0x82, 0x01, 0x00], mediumPayload),
        "octet large": wrap(0x04, [0x82, 0x10, 0x00], largePayload),
        "oid": new Uint8Array([0x06, 0x06, 0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D]),
        "long tag": new Uint8Array([0x1F, 0x81, 0x00, 0x01, 0xFF]),
        "context constructed": new Uint8Array([
            0xA0, 0x06,
            0x02, 0x01, 0x01,
            0x02, 0x01, 0x02,
        ]),
        "null": new Uint8Array([0x05, 0x00]),
    };
}

const cases = makeCases();
const mix = [
    cases["boolean true"],
    cases["integer small"],
    cases["octet short"],
    cases["oid"],
    cases["null"],
    cases["context constructed"],
    cases["octet medium"],
];

const el = new DERElement();

function decodeOne(bytes) {
    return el.fromBytes(bytes);
}

function decodeMix(arr) {
    let n = 0;
    for (let i = 0; i < arr.length; i++) n += el.fromBytes(arr[i]);
    return n;
}

function bench(fn, input, n) {
    for (let i = 0; i < 50_000; i++) fn(input);
    const t0 = performance.now();
    for (let i = 0; i < n; i++) fn(input);
    const t1 = performance.now();
    return ((t1 - t0) / n) * 1e6;
}

// Baseline captured before the fromBytes rewrite (same harness / machine).
const before = {
    "boolean true": 36.4,
    "integer small": 27.4,
    "octet short": 28.5,
    "octet medium": 1812.8,
    "octet large": 2744.0,
    "oid": 27.8,
    "long tag": 32.9,
    "context constructed": 31.1,
    "null": 23.9,
    "realistic mix": 1648.7,
};

console.log("DERElement.fromBytes — before vs after\n");
console.log(
    `${"case".padEnd(22)} ${"before".padStart(10)} ${"after".padStart(10)} ${"speedup".padStart(9)}`,
);

for (const [name, input] of Object.entries(cases)) {
    const ns = bench(decodeOne, input, name.includes("large") ? 500_000 : 2_000_000);
    const b = before[name];
    console.log(
        `${name.padEnd(22)} ${b.toFixed(1).padStart(8)}ns ${ns.toFixed(1).padStart(8)}ns ${(b / ns).toFixed(2).padStart(7)}x`,
    );
}

{
    const ns = bench(decodeMix, mix, 500_000);
    const b = before["realistic mix"];
    console.log(
        `${"realistic mix".padEnd(22)} ${b.toFixed(1).padStart(8)}ns ${ns.toFixed(1).padStart(8)}ns ${(b / ns).toFixed(2).padStart(7)}x`,
    );
}
