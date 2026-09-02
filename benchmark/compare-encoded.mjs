/**
 * Benchmark zero-allocation encoded string comparison vs deconstruct + Buffer.compare.
 * Run: npm run build && node benchmark/compare-encoded.mjs
 */
import BERElement from "../dist/codecs/ber.mjs";
import {
    compareContentOctets,
} from "../dist/utils/compareEncoded/index.mjs";
import { Buffer } from "node:buffer";

function bench(fn, n) {
    for (let i = 0; i < 5_000; i++) {
        fn();
    }
    const t0 = performance.now();
    for (let i = 0; i < n; i++) {
        fn();
    }
    return ((performance.now() - t0) / n) * 1e6;
}

function makePrimitive(size, fill = 0x41) {
    const el = new BERElement();
    el.value = new Uint8Array(size).fill(fill);
    return el;
}

function makeConstructed(size, fragmentSize, fill = 0x42) {
    const fragments = [];
    for (let offset = 0; offset < size; offset += fragmentSize) {
        const chunk = new BERElement();
        chunk.tagNumber = 4;
        const end = Math.min(offset + fragmentSize, size);
        chunk.value = new Uint8Array(end - offset).fill(fill);
        fragments.push(chunk);
    }
    const el = new BERElement();
    el.tagNumber = 4;
    el.construction = 1;
    el.sequence = fragments;
    return el;
}

function runOctetCase(label, a, b, iterations) {
    const deconstructNs = bench(
        () => Buffer.compare(a.deconstruct("OCTET STRING"), b.deconstruct("OCTET STRING")),
        iterations,
    );
    const zeroAllocNs = bench(() => compareContentOctets(a, b), iterations);
    console.log(
        `${label.padEnd(28)} deconstruct: ${deconstructNs.toFixed(1)} ns/op`
        + `  zero-alloc: ${zeroAllocNs.toFixed(1)} ns/op`
        + `  (${(deconstructNs / zeroAllocNs).toFixed(2)}x)`,
    );
}

function runStringCase(label, a, b, iterations) {
    const deconstructNs = bench(
        () => Buffer.compare(a.deconstruct("PrintableString"), b.deconstruct("PrintableString")) === 0,
        iterations,
    );
    const zeroAllocNs = bench(() => a.stringMatches(b), iterations);
    console.log(
        `${label.padEnd(28)} deconstruct: ${deconstructNs.toFixed(1)} ns/op`
        + `  zero-alloc: ${zeroAllocNs.toFixed(1)} ns/op`
        + `  (${(deconstructNs / zeroAllocNs).toFixed(2)}x)`,
    );
}

function runNumericCase(label, a, b, iterations) {
    const deconstructNs = bench(
        () => Buffer.compare(a.deconstruct("NumericString"), b.deconstruct("NumericString")) === 0,
        iterations,
    );
    const zeroAllocNs = bench(() => a.numericStringMatches(b), iterations);
    console.log(
        `${label.padEnd(28)} deconstruct: ${deconstructNs.toFixed(1)} ns/op`
        + `  zero-alloc: ${zeroAllocNs.toFixed(1)} ns/op`
        + `  (${(deconstructNs / zeroAllocNs).toFixed(2)}x)`,
    );
}

console.log("compareContentOctets (equal payloads)");
runOctetCase("primitive 64B", makePrimitive(64), makePrimitive(64), 200_000);
runOctetCase("primitive 4KiB", makePrimitive(4096), makePrimitive(4096), 50_000);
runOctetCase("constructed 4KiB", makeConstructed(4096, 64), makeConstructed(4096, 64), 50_000);
runOctetCase("constructed 64KiB", makeConstructed(65536, 1024), makeConstructed(65536, 1024), 5_000);

const printableA = new BERElement();
printableA.printableString = "O=Example,C=US";
const printableB = new BERElement();
printableB.printableString = "O=Example,C=US";

const numericA = new BERElement();
numericA.numericString = "12345 67890";
const numericB = new BERElement();
numericB.numericString = "12345 67890";

console.log("\nASN1Element.stringMatches (PrintableString)");
runStringCase("primitive printable", printableA, printableB, 100_000);

console.log("\nASN1Element.numericStringMatches");
runNumericCase("primitive numeric", numericA, numericB, 100_000);
