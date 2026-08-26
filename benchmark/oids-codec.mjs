/**
 * Benchmark OBJECT IDENTIFIER and RELATIVE-OID encode/decode.
 *
 * Compares the previous implementations (inline) against the current codecs
 * in `dist`, so the table is a before/after on this machine.
 *
 * Run: node benchmark/oids-codec.mjs
 */
import { strict as assert } from "node:assert";
import { Buffer } from "node:buffer";
import encodeRelativeObjectIdentifier from "../dist/codecs/x690/encoders/encodeRelativeObjectIdentifier.mjs";
import decodeRelativeObjectIdentifier from "../dist/codecs/x690/decoders/decodeRelativeObjectIdentifier.mjs";
import ObjectIdentifier from "../dist/types/ObjectIdentifier.mjs";

function sameBytes (a, b) {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

function sameArcs (a, b) {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

/** Previous RELATIVE-OID encoder: number[] + Buffer.from. */
function oldEncodeRelative (value) {
    const ret = [];
    for (let a = 0; a < value.length; a++) {
        const arc = value[a];
        if (arc < 128) {
            ret.push(arc);
            continue;
        }
        let l = 0;
        let i = arc;
        while (i > 0) {
            l++;
            i >>>= 7;
        }
        for (let j = l - 1; j >= 0; j--) {
            let o = (arc >>> (j * 7));
            o &= 0x7f;
            if (j !== 0) {
                o |= 0x80;
            }
            ret.push(o);
        }
    }
    return Buffer.from(ret);
}

/** Previous RELATIVE-OID decoder: byte loop with 32-bit shifts. */
function oldDecodeRelative (value) {
    if (value.length === 0) {
        return [];
    }
    if (value.length > 1 && value[value.length - 1] & 0b10000000) {
        throw new Error("Relative OID was truncated.");
    }
    const nodes = [];
    let current_node = 0;
    for (let i = 0; i < value.length; i++) {
        const byte = value[i];
        if ((byte === 0x80) && (current_node === 0)) {
            throw new Error("Prohibited padding on RELATIVE-OID node.");
        }
        current_node <<= 7;
        current_node += (byte & 0b0111_1111);
        if ((byte & 0b1000_0000) === 0) {
            nodes.push(current_node);
            current_node = 0;
        }
    }
    return nodes;
}

/** Previous ObjectIdentifier.fromBytes validation. */
function oldFromBytes (bytes) {
    if (bytes.length === 0) {
        throw new Error("Encoded value was too short to be an OBJECT IDENTIFIER!");
    }
    if (bytes[bytes.length - 1] & 0b10000000) {
        throw new Error("OID was truncated.");
    }
    let current_node = 0;
    for (let i = 1; i < bytes.length; i++) {
        const byte = bytes[i];
        if ((current_node === 0) && (byte === 0x80)) {
            throw new Error("Prohibited padding on OBJECT IDENTIFIER node.");
        }
        if (byte < 0x80) {
            current_node = 0;
        } else {
            current_node++;
        }
    }
    return ObjectIdentifier.fromBytesUnsafe(bytes).byteLength();
}

/** Previous ObjectIdentifier.fromParts: extra arrays and Buffer.concat. */
function oldFromParts (nodes, prefix) {
    const _nodes = typeof prefix === "number" ? [ prefix, ...nodes ] : nodes;
    let encoding;
    if (prefix && typeof prefix !== "number") {
        encoding = Buffer.concat([
            prefix.toBytesUnsafe(),
            encodeRelativeObjectIdentifier(_nodes),
        ]);
    } else {
        encoding = encodeRelativeObjectIdentifier([
            (_nodes[0] * 40) + _nodes[1],
            ..._nodes.slice(2),
        ]);
    }
    return ObjectIdentifier.fromBytesUnsafe(encoding);
}

/** Previous ObjectIdentifier.nodes expansion. */
function oldNodes (bytes) {
    const subcomponents = oldDecodeRelative(bytes);
    return [
        Math.min(2, Math.floor(subcomponents[0] / 40)),
        ((subcomponents[0] >= 80)
            ? (subcomponents[0] - 80)
            : (subcomponents[0] % 40)),
        ...subcomponents.slice(1),
    ];
}

const relativeCases = {
    "all-single": [ 2, 5, 4, 3 ],
    "short": [ 1, 3, 6, 1, 5, 5, 7, 3, 1 ],
    "mixed-2": [ 1, 3, 6, 1, 4, 1, 343 ],
    "rsa": [ 1, 2, 840, 113549, 1, 1, 1 ],
    "p256": [ 1, 2, 840, 10045, 3, 1, 7 ],
    "enterprise": [ 1, 3, 6, 1, 4, 1, 11591, 4, 11 ],
    "large-32": [ 1, 2, 2147483647 ],
    "0x80-middle": [ 42, 16390 ],
};

const oidCases = {
    "cn": [ 2, 5, 4, 3 ],
    "basicConstraints": [ 2, 5, 29, 19 ],
    "rsaEncryption": [ 1, 2, 840, 113549, 1, 1, 1 ],
    "sha256WithRSA": [ 1, 2, 840, 113549, 1, 1, 11 ],
    "ecPublicKey": [ 1, 2, 840, 10045, 2, 1 ],
    "prime256v1": [ 1, 2, 840, 10045, 3, 1, 7 ],
    "enterprise": [ 1, 3, 6, 1, 4, 1, 11591, 4, 11 ],
    "large-32": [ 1, 2, 2147483647 ],
};

const relativeMix = Object.values(relativeCases);
const oidMix = Object.values(oidCases);
const relativeEncoded = Object.fromEntries(
    Object.entries(relativeCases).map(([ name, arcs ]) => [ name, encodeRelativeObjectIdentifier(arcs) ]),
);
const relativeEncodedMix = Object.values(relativeEncoded);
const oidObjects = Object.fromEntries(
    Object.entries(oidCases).map(([ name, arcs ]) => [ name, ObjectIdentifier.fromParts(arcs) ]),
);
const oidEncoded = Object.fromEntries(
    Object.entries(oidObjects).map(([ name, oid ]) => [ name, oid.toBytesUnsafe() ]),
);
const oidEncodedMix = Object.values(oidEncoded);
const oidObjectMix = Object.values(oidObjects);
const oidPrefixCases = {
    "ds+attr": { prefixArcs: [ 2, 5 ], nodes: [ 4, 3 ] },
    "pkcs1+rsa": { prefixArcs: [ 1, 2, 840, 113549, 1, 1 ], nodes: [ 1 ] },
    "enterprise+leaf": { prefixArcs: [ 1, 3, 6, 1, 4, 1 ], nodes: [ 11591, 4, 11 ] },
    "numeric-2": { prefix: 2, nodes: [ 5, 4, 3 ] },
};

const oidPrefixInputs = Object.fromEntries(
    Object.entries(oidPrefixCases).map(([ name, spec ]) => {
        if (typeof spec.prefix === "number") {
            return [ name, { nodes: spec.nodes, prefix: spec.prefix } ];
        }
        return [
            name,
            { nodes: spec.nodes, prefix: ObjectIdentifier.fromParts(spec.prefixArcs) },
        ];
    }),
);
const oidPrefixMix = Object.values(oidPrefixInputs);

console.log("Verifying before/after agreement...");
for (const [ name, arcs ] of Object.entries(relativeCases)) {
    const oldEnc = oldEncodeRelative(arcs);
    const newEnc = encodeRelativeObjectIdentifier(arcs);
    assert(sameBytes(oldEnc, newEnc), `RELATIVE-OID encode mismatch: ${name}`);
    assert(sameArcs(oldDecodeRelative(newEnc), decodeRelativeObjectIdentifier(newEnc)), `RELATIVE-OID decode mismatch: ${name}`);
    assert(sameArcs(decodeRelativeObjectIdentifier(newEnc), arcs), `RELATIVE-OID roundtrip failed: ${name}`);
}
for (const [ name, arcs ] of Object.entries(oidCases)) {
    const oid = ObjectIdentifier.fromParts(arcs);
    const bytes = oid.toBytesUnsafe();
    assert(sameBytes(oldFromParts(arcs).toBytesUnsafe(), bytes), `OBJECT IDENTIFIER encode mismatch: ${name}`);
    assert.equal(oldFromBytes(bytes), bytes.length, `OBJECT IDENTIFIER fromBytes mismatch: ${name}`);
    assert(sameArcs(oldNodes(bytes), oid.nodes), `OBJECT IDENTIFIER nodes mismatch: ${name}`);
    assert(sameArcs(oid.nodes, arcs), `OBJECT IDENTIFIER nodes failed: ${name}`);
}
for (const [ name, input ] of Object.entries(oidPrefixInputs)) {
    const oldOid = oldFromParts(input.nodes, input.prefix);
    const newOid = ObjectIdentifier.fromParts(input.nodes, input.prefix);
    assert(
        ObjectIdentifier.compare(oldOid, newOid),
        `OBJECT IDENTIFIER prefix fromParts mismatch: ${name}`,
    );
}
assert.throws(() => decodeRelativeObjectIdentifier(new Uint8Array([ 0x80, 0x06 ])));
assert.throws(() => decodeRelativeObjectIdentifier(new Uint8Array([ 0x80, 0x81 ])));
assert.throws(() => ObjectIdentifier.fromBytes(new Uint8Array(0)));
assert.throws(() => ObjectIdentifier.fromBytes(new Uint8Array([ 0x42, 0x80 ])));
console.log("All implementations agree.\n");

function bench (fn, items, n = 400_000) {
    const len = items.length;
    for (let i = 0; i < 20_000; i++) {
        fn(items[i % len]);
    }
    let acc = 0;
    let best = Infinity;
    for (let sample = 0; sample < 3; sample++) {
        acc = 0;
        const t0 = performance.now();
        for (let i = 0; i < n; i++) {
            acc += fn(items[i % len]);
        }
        const ns = ((performance.now() - t0) / n) * 1e6;
        if (ns < best) {
            best = ns;
        }
    }
    if (acc < 0) {
        throw new Error("unreachable");
    }
    return best;
}

function report (title, beforeFn, afterFn, namedItems, mixItems) {
    const names = Object.keys(namedItems);
    const width = Math.max(...names.map((name) => name.length), 12);
    console.log(`=== ${title} ===`);
    console.log(
        `${"case".padEnd(width)} ${"before".padStart(10)} ${"after".padStart(10)} ${"speedup".padStart(9)}`,
    );
    for (const name of names) {
        const items = [ namedItems[name] ];
        const beforeNs = bench(beforeFn, items);
        const afterNs = bench(afterFn, items);
        console.log(
            `${name.padEnd(width)} ${beforeNs.toFixed(1).padStart(8)}ns ${afterNs.toFixed(1).padStart(8)}ns ${(beforeNs / afterNs).toFixed(2).padStart(7)}x`,
        );
    }
    const beforeMix = bench(beforeFn, mixItems);
    const afterMix = bench(afterFn, mixItems);
    console.log(
        `${"mix".padEnd(width)} ${beforeMix.toFixed(1).padStart(8)}ns ${afterMix.toFixed(1).padStart(8)}ns ${(beforeMix / afterMix).toFixed(2).padStart(7)}x`,
    );
    console.log();
}

report(
    "encode RELATIVE-OID",
    (arcs) => oldEncodeRelative(arcs).length,
    (arcs) => encodeRelativeObjectIdentifier(arcs).length,
    relativeCases,
    relativeMix,
);

report(
    "decode RELATIVE-OID",
    (bytes) => oldDecodeRelative(bytes).length,
    (bytes) => decodeRelativeObjectIdentifier(bytes).length,
    relativeEncoded,
    relativeEncodedMix,
);

report(
    "encode OBJECT IDENTIFIER (fromParts)",
    (arcs) => oldFromParts(arcs).byteLength(),
    (arcs) => ObjectIdentifier.fromParts(arcs).byteLength(),
    oidCases,
    oidMix,
);

report(
    "encode OBJECT IDENTIFIER (fromParts with prefix)",
    (input) => oldFromParts(input.nodes, input.prefix).byteLength(),
    (input) => ObjectIdentifier.fromParts(input.nodes, input.prefix).byteLength(),
    oidPrefixInputs,
    oidPrefixMix,
);

report(
    "decode OBJECT IDENTIFIER (fromBytes)",
    (bytes) => oldFromBytes(bytes),
    (bytes) => ObjectIdentifier.fromBytes(bytes).byteLength(),
    oidEncoded,
    oidEncodedMix,
);

report(
    "OBJECT IDENTIFIER nodes",
    (oid) => oldNodes(oid.toBytesUnsafe()).length,
    (oid) => oid.nodes.length,
    oidObjects,
    oidObjectMix,
);
