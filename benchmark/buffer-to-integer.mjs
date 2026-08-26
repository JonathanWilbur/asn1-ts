import { Buffer } from "node:buffer";

function current(input) {
    const buf = (input instanceof Buffer)
        ? input
        : Buffer.from(input.buffer, input.byteOffset, input.byteLength);
    switch (buf.length) {
    case (0): return 0;
    case (1): return buf.readInt8();
    case (2): return buf.readInt16BE();
    case (4): return buf.readInt32BE();
    case (8): return buf.readBigInt64BE();
    default: {
        if (buf[0] & 0x80) {
            return BigInt.asIntN(
                (buf.length * 8),
                BigInt(`0x${buf.toString("hex")}`),
            );
        } else {
            return BigInt(`0x${buf.toString("hex")}`);
        }
    }
    }
}

function bytesToUnsignedBigInt(buf) {
    const len = buf.length;
    let n = 0n;
    let i = 0;
    switch (len & 7) {
    case 1:
        n = BigInt(buf[0]);
        i = 1;
        break;
    case 2:
        n = BigInt(buf.readUInt16BE(0));
        i = 2;
        break;
    case 3:
        n = BigInt(buf.readUIntBE(0, 3));
        i = 3;
        break;
    case 4:
        n = BigInt(buf.readUInt32BE(0));
        i = 4;
        break;
    case 5:
        n = (BigInt(buf[0]) << 32n) | BigInt(buf.readUInt32BE(1));
        i = 5;
        break;
    case 6:
        n = (BigInt(buf.readUInt16BE(0)) << 32n) | BigInt(buf.readUInt32BE(2));
        i = 6;
        break;
    case 7:
        n = (BigInt(buf[0]) << 48n)
            | (BigInt(buf.readUInt16BE(1)) << 32n)
            | BigInt(buf.readUInt32BE(3));
        i = 7;
        break;
    }
    for (; i < len; i += 8) {
        n = (n << 64n) | buf.readBigUInt64BE(i);
    }
    return n;
}

function optimized(input) {
    const len = input.length;
    switch (len) {
    case 0: return 0;
    case 1: return (input[0] << 24) >> 24;
    case 2: return ((input[0] << 24) >> 16) | input[1];
    case 3: return BigInt(((input[0] << 24) >> 8) | (input[1] << 8) | input[2]);
    case 4: return (input[0] << 24) | (input[1] << 16) | (input[2] << 8) | input[3];
    }

    const buf = (input instanceof Buffer)
        ? input
        : Buffer.from(input.buffer, input.byteOffset, input.byteLength);
    switch (len) {
    case 5: return BigInt(buf.readIntBE(0, 5));
    case 6: return BigInt(buf.readIntBE(0, 6));
    case 8: return buf.readBigInt64BE();
    }

    const n = (len < 24)
        ? bytesToUnsignedBigInt(buf)
        : BigInt(`0x${buf.toString("hex")}`);
    return (buf[0] & 0x80)
        ? n - (1n << (BigInt(len) << 3n))
        : n;
}

function hexAlways(input) {
    const buf = (input instanceof Buffer)
        ? input
        : Buffer.from(input.buffer, input.byteOffset, input.byteLength);
    if (buf.length === 0) return 0;
    const n = BigInt(`0x${buf.toString("hex")}`);
    if (buf[0] & 0x80) return n - (1n << (BigInt(buf.length) << 3n));
    return n;
}

function byteLoop(input) {
    const buf = (input instanceof Buffer)
        ? input
        : Buffer.from(input.buffer, input.byteOffset, input.byteLength);
    const len = buf.length;
    switch (len) {
    case 0: return 0;
    case 1: return buf.readInt8();
    case 2: return buf.readInt16BE();
    case 4: return buf.readInt32BE();
    case 8: return buf.readBigInt64BE();
    }
    let n = 0n;
    for (let i = 0; i < len; i++) {
        n = (n << 8n) | BigInt(buf[i]);
    }
    if (buf[0] & 0x80) {
        return n - (1n << (BigInt(len) << 3n));
    }
    return n;
}

const impls = { current, optimized, hexAlways, byteLoop };

function same(a, b) {
    if (typeof a === "number" && typeof b === "number") return Object.is(a, b);
    return BigInt(a) === BigInt(b);
}

const fixtures = [];
function add(bytes) {
    fixtures.push(Buffer.from(bytes));
}
add([]);
add([0x00]);
add([0x7F]);
add([0x80]);
add([0xFF]);
add([0x01, 0x00]);
add([0x7F, 0xFF]);
add([0x80, 0x00]);
add([0xFF, 0x7F]);
add([0x01, 0x00, 0x00]);
add([0x7F, 0xFF, 0xFF]);
add([0x80, 0x00, 0x00]);
add([0xFF, 0x80, 0x00]);
add([0x01, 0x00, 0x00, 0x00]);
add([0x7F, 0xFF, 0xFF, 0xFF]);
add([0x80, 0x00, 0x00, 0x00]);
add([0x01, 0x02, 0x03, 0x04, 0x05]);
add([0x80, 0x00, 0x00, 0x00, 0x01]);
add([0x01, 0x02, 0x03, 0x04, 0x05, 0x06]);
add([0x80, 0x11, 0x22, 0x33, 0x44, 0x55]);
add([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]);
add([0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]);
add([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]);
add([0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]);
add([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09]);
add([0x80, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88]);
add(Array.from({ length: 16 }, (_, i) => i + 1));
add([0x80, ...Array.from({ length: 15 }, (_, i) => i)]);
add(Array.from({ length: 32 }, (_, i) => (i * 17) & 0x7F));
add([0xFF, ...Array.from({ length: 31 }, () => 0x00)]);
add(Array.from({ length: 64 }, (_, i) => (i * 13) & 0xFF));

for (const [name, fn] of Object.entries(impls)) {
    if (name === "current") continue;
    for (const buf of fixtures) {
        const a = current(buf);
        const b = fn(buf);
        if (!same(a, b)) {
            console.log("MISMATCH", name, [...buf], a, typeof a, b, typeof b);
            throw new Error("mismatch");
        }
        const u8 = new Uint8Array(buf);
        if (!same(a, fn(u8))) {
            console.log("MISMATCH Uint8Array", name, [...buf]);
            throw new Error("mismatch");
        }
    }
}
console.log("all match current (numeric value)\n");

const cases = {
    "1-byte": fixtures.filter((b) => b.length === 1),
    "2-byte": fixtures.filter((b) => b.length === 2),
    "3-byte": fixtures.filter((b) => b.length === 3),
    "4-byte": fixtures.filter((b) => b.length === 4),
    "5-7-byte": fixtures.filter((b) => b.length >= 5 && b.length <= 7),
    "8-byte": fixtures.filter((b) => b.length === 8),
    "9-16-byte": fixtures.filter((b) => b.length >= 9 && b.length <= 16),
    "32-64-byte": fixtures.filter((b) => b.length >= 32),
    "mixed": fixtures.filter((b) => b.length > 0),
};

function bench(fn, values) {
    for (let i = 0; i < 20000; i++) fn(values[i % values.length]);
    const n = 400_000;
    const t0 = performance.now();
    for (let i = 0; i < n; i++) fn(values[i % values.length]);
    const t1 = performance.now();
    return ((t1 - t0) / n) * 1e6;
}

for (const [cname, values] of Object.entries(cases)) {
    if (values.length === 0) continue;
    console.log(`=== ${cname} ===`);
    const results = [];
    for (const [name, fn] of Object.entries(impls)) {
        const ns = bench(fn, values);
        results.push([name, ns]);
    }
    results.sort((a, b) => a[1] - b[1]);
    const base = results.find((r) => r[0] === "current")[1];
    for (const [name, ns] of results) {
        console.log(`${name.padEnd(14)} ${ns.toFixed(1).padStart(8)} ns/op  ${(base / ns).toFixed(2)}x`);
    }
    console.log();
}

console.log("=== length sweep (pos + neg) ===");
const header = "len".padStart(4) + " " + Object.keys(impls).map((n) => n.padStart(18)).join("");
console.log(header);
for (const len of [3, 5, 6, 7, 9, 12, 16, 20, 24, 32, 64, 128]) {
    const pos = Buffer.from(Array.from({ length: len }, (_, i) => (i + 1) & 0x7F));
    const neg = Buffer.from([0x80, ...Array.from({ length: len - 1 }, (_, i) => i & 0xFF)]);
    const values = [pos, neg];
    const times = {};
    for (const [name, fn] of Object.entries(impls)) {
        times[name] = bench(fn, values);
    }
    const base = times.current;
    console.log(
        String(len).padStart(4),
        ...Object.keys(impls).map((n) => {
            return `${times[n].toFixed(0)}ns ${(base / times[n]).toFixed(2)}x`.padStart(18);
        }),
    );
}
