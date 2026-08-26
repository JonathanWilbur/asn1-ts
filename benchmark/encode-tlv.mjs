/**
 * Benchmark TLV encoding: previous Buffer.concat(toBuffers()) vs current
 * toBytes() / encodeInto().
 *
 * The "old concat" path recreates the previous toBytes implementation:
 * spread + flatMap fragment collection, then Buffer.concat.
 *
 * Run: node benchmark/encode-tlv.mjs
 */
import * as asn1 from "../dist/index.mjs";
import { Buffer } from "node:buffer";
import { strict as assert } from "node:assert";

const {
    DERElement,
    ASN1Construction,
    ASN1TagClass,
    ASN1UniversalType,
} = asn1;

function makeInt (n) {
    const el = new DERElement();
    el.tagNumber = ASN1UniversalType.integer;
    el.integer = n;
    return el;
}

function makeOctet (len) {
    const el = new DERElement();
    el.tagNumber = ASN1UniversalType.octetString;
    el.octetString = new Uint8Array(len).fill(0x5A);
    return el;
}

function makeUtf8 (s) {
    const el = new DERElement();
    el.tagNumber = ASN1UniversalType.utf8String;
    el.utf8String = s;
    return el;
}

function makeOid () {
    const el = new DERElement();
    el.tagNumber = ASN1UniversalType.objectIdentifier;
    el.objectIdentifier = asn1.ObjectIdentifier.fromParts([ 1, 3, 6, 1, 4, 1, 1466 ]);
    return el;
}

function wideSeq (n) {
    const kids = new Array(n);
    for (let i = 0; i < n; i++) {
        kids[i] = makeInt(i & 0x7F);
    }
    return DERElement.fromSequence(kids);
}

function nestedSeq (depth, width) {
    let el = makeInt(1);
    for (let d = 0; d < depth; d++) {
        const kids = new Array(width);
        kids[0] = el;
        for (let i = 1; i < width; i++) {
            kids[i] = makeInt(i);
        }
        el = DERElement.fromSequence(kids);
    }
    return el;
}

function realistic () {
    const inner = [];
    for (let i = 0; i < 10; i++) {
        inner.push(makeInt(i));
    }
    return DERElement.fromSequence([
        makeInt(42),
        makeUtf8("CN=example,O=asn1-ts"),
        makeOid(),
        DERElement.fromSequence(inner),
        makeOctet(64),
    ]);
}

/**
 * Previous toBytes(): Buffer.concat of fragments collected with spread/flatMap.
 * Does not use the new appendBuffers / encodeInto path.
 */
function oldToBuffers (el) {
    return [
        el.tagAndLengthBytes(),
        ...(el.construction === ASN1Construction.constructed
            ? el.sequence.flatMap(oldToBuffers)
            : [ el.value ]),
    ];
}

function oldToBytes (el) {
    return Buffer.concat(oldToBuffers(el));
}

function bytesEqual (a, b, name) {
    assert.equal(a.length, b.length, `${name}: length ${a.length} vs ${b.length}`);
    assert.equal(Buffer.compare(Buffer.from(a), Buffer.from(b)), 0, `${name}: bytes differ`);
}

const cases = {
    "integer": () => makeInt(5),
    "octet 16": () => makeOctet(16),
    "octet 256": () => makeOctet(256),
    "octet 4096": () => makeOctet(4096),
    "explicit tag": () => {
        const outer = new DERElement(
            ASN1TagClass.context,
            ASN1Construction.constructed,
            0,
        );
        outer.inner = makeInt(99);
        return outer;
    },
    "seq 20": () => wideSeq(20),
    "seq 200": () => wideSeq(200),
    "seq 2000": () => wideSeq(2000),
    "nested 20x4": () => nestedSeq(20, 4),
    "realistic msg": realistic,
};

console.log("Verifying old concat, toBytes, and encodeInto agree...");
for (const [name, factory] of Object.entries(cases)) {
    const el = factory();
    const a = oldToBytes(el);
    const b = el.toBytes();
    const dest = Buffer.allocUnsafe(el.tlvLength());
    const end = el.encodeInto(dest, 0);
    assert.equal(end, dest.length, `${name}: encodeInto length`);
    bytesEqual(a, b, `${name} old vs toBytes`);
    bytesEqual(a, dest, `${name} old vs encodeInto`);
}
console.log("All encodings agree.\n");

const ITERS = {
    "integer": 1_000_000,
    "octet 16": 500_000,
    "octet 256": 200_000,
    "octet 4096": 50_000,
    "explicit tag": 500_000,
    "seq 20": 80_000,
    "seq 200": 15_000,
    "seq 2000": 2_000,
    "nested 20x4": 50_000,
    "realistic msg": 40_000,
};

function bench (fn, iters) {
    for (let i = 0; i < Math.min(iters, 20_000); i++) {
        fn();
    }
    let best = Infinity;
    for (let sample = 0; sample < 3; sample++) {
        const t0 = performance.now();
        for (let i = 0; i < iters; i++) {
            fn();
        }
        const ns = ((performance.now() - t0) / iters) * 1e6;
        if (ns < best) {
            best = ns;
        }
    }
    return best;
}

function fmt (ns) {
    return ns.toFixed(1).padStart(10);
}

console.log("Repeat encode of a prebuilt tree (length cache already warm)\n");
console.log(
    `${"case".padEnd(16)} ${"bytes".padStart(6)} ${"old concat".padStart(12)} ${"toBytes".padStart(12)} ${"encodeInto".padStart(12)} ${"toBytes".padStart(9)} ${"encodeInto".padStart(10)}`,
);
console.log(
    `${"".padEnd(16)} ${"".padStart(6)} ${"ns/op".padStart(12)} ${"ns/op".padStart(12)} ${"ns/op".padStart(12)} ${"vs old".padStart(9)} ${"vs old".padStart(10)}`,
);

for (const [name, factory] of Object.entries(cases)) {
    const el = factory();
    const size = el.tlvLength();
    const dest = Buffer.allocUnsafe(size);
    // Warm the length cache so this measures writing, not sizing.
    el.toBytes();
    const iters = ITERS[name];
    const oldNs = bench(() => oldToBytes(el), iters);
    const newNs = bench(() => el.toBytes(), iters);
    const intoNs = bench(() => el.encodeInto(dest, 0), iters);
    console.log(
        `${name.padEnd(16)} ${String(size).padStart(6)} ${fmt(oldNs)} ${fmt(newNs)} ${fmt(intoNs)} ${(oldNs / newNs).toFixed(2).padStart(8)}x ${(oldNs / intoNs).toFixed(2).padStart(9)}x`,
    );
}

console.log("\nFirst encode of independent prebuilt trees (cold length cache per tree)\n");

const FIRST = [
    [ "seq 200", () => wideSeq(200), 400 ],
    [ "seq 2000", () => wideSeq(2000), 80 ],
    [ "nested 20x4", () => nestedSeq(20, 4), 400 ],
    [ "realistic msg", realistic, 400 ],
];

{
    const warm = wideSeq(50);
    oldToBytes(warm);
    warm.toBytes();
}

console.log(
    `${"case".padEnd(16)} ${"trees".padStart(6)} ${"old concat".padStart(12)} ${"toBytes".padStart(12)} ${"toBytes".padStart(9)}`,
);

for (const [name, factory, n] of FIRST) {
    const oldTrees = Array.from({ length: n }, factory);
    const newTrees = Array.from({ length: n }, factory);
    const tOld0 = performance.now();
    for (let i = 0; i < n; i++) {
        oldToBytes(oldTrees[i]);
    }
    const oldNs = ((performance.now() - tOld0) / n) * 1e6;
    const tNew0 = performance.now();
    for (let i = 0; i < n; i++) {
        newTrees[i].toBytes();
    }
    const newNs = ((performance.now() - tNew0) / n) * 1e6;
    console.log(
        `${name.padEnd(16)} ${String(n).padStart(6)} ${fmt(oldNs)} ${fmt(newNs)} ${(oldNs / newNs).toFixed(2).padStart(8)}x`,
    );
}
