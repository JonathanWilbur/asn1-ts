const TRUE_BIT = 1;
const FALSE_BIT = 0;

class ASN1Error extends Error {}

function original(value) {
    if (value.length === 0) {
        throw new ASN1Error("ASN.1 BIT STRING cannot be encoded on zero bytes!");
    }
    if (value.length === 1 && value[0] !== 0) {
        throw new ASN1Error("ASN.1 BIT STRING encoded with deceptive first byte!");
    }
    if (value[0] > 7) {
        throw new ASN1Error("First byte of an ASN.1 BIT STRING must be <= 7!");
    }

    const ret = [];
    for (let i = 1; i < value.length; i++) {
        ret.push(
            ((value[i] & 0b10000000) ? TRUE_BIT : FALSE_BIT),
            ((value[i] & 0b01000000) ? TRUE_BIT : FALSE_BIT),
            ((value[i] & 0b00100000) ? TRUE_BIT : FALSE_BIT),
            ((value[i] & 0b00010000) ? TRUE_BIT : FALSE_BIT),
            ((value[i] & 0b00001000) ? TRUE_BIT : FALSE_BIT),
            ((value[i] & 0b00000100) ? TRUE_BIT : FALSE_BIT),
            ((value[i] & 0b00000010) ? TRUE_BIT : FALSE_BIT),
            ((value[i] & 0b00000001) ? TRUE_BIT : FALSE_BIT),
        );
    }
    for (const bit of ret.slice((ret.length - value[0]))) {
        if (bit) throw new ASN1Error("BIT STRING had a trailing set bit.");
    }
    ret.length -= value[0];
    return new Uint8ClampedArray(ret);
}

function optimized(value) {
    if (value.length === 0) {
        throw new ASN1Error("ASN.1 BIT STRING cannot be encoded on zero bytes!");
    }
    if (value.length === 1 && value[0] !== 0) {
        throw new ASN1Error("ASN.1 BIT STRING encoded with deceptive first byte!");
    }
    const unused = value[0];
    if (unused > 7) {
        throw new ASN1Error("First byte of an ASN.1 BIT STRING must be <= 7!");
    }
    if (unused !== 0 && (value[value.length - 1] & ((1 << unused) - 1))) {
        throw new ASN1Error("BIT STRING had a trailing set bit.");
    }

    const bitLen = ((value.length - 1) << 3) - unused;
    const ret = new Uint8ClampedArray(bitLen);
    const lastFull = unused === 0 ? value.length - 1 : value.length - 2;
    let j = 0;
    for (let i = 1; i <= lastFull; i++, j += 8) {
        const b = value[i];
        ret[j]     = b >> 7;
        ret[j + 1] = (b >> 6) & 1;
        ret[j + 2] = (b >> 5) & 1;
        ret[j + 3] = (b >> 4) & 1;
        ret[j + 4] = (b >> 3) & 1;
        ret[j + 5] = (b >> 2) & 1;
        ret[j + 6] = (b >> 1) & 1;
        ret[j + 7] = b & 1;
    }
    if (j < bitLen) {
        const b = value[value.length - 1];
        for (let k = 0; j < bitLen; j++, k++) {
            ret[j] = (b >> (7 - k)) & 1;
        }
    }
    return ret;
}

function makeEncoded(bitLen, pattern = "mixed") {
    const unused = (8 - (bitLen & 7)) & 7;
    const packedLen = (bitLen + 7) >> 3;
    const value = new Uint8Array(packedLen + 1);
    value[0] = unused;
    for (let i = 0; i < packedLen; i++) {
        if (pattern === "ones") {
            value[i + 1] = 0xff;
        } else if (pattern === "zeros") {
            value[i + 1] = 0;
        } else {
            value[i + 1] = (i * 47 + 13) & 0xff;
        }
    }
    if (unused) {
        value[packedLen] &= (0xff << unused) & 0xff;
    }
    return value;
}

function assertEqual(a, b, name, len) {
    if (a.length !== b.length) {
        throw new Error(`${name} length mismatch at ${len}: ${a.length} vs ${b.length}`);
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            throw new Error(`${name} mismatch at bit ${i} (len=${len}): ${a[i]} vs ${b[i]}`);
        }
    }
}

function assertThrows(fn, name) {
    try {
        fn();
    } catch {
        return;
    }
    throw new Error(`${name} did not throw`);
}

const impls = {
    original,
    optimized,
};

const checkLens = [0, 1, 7, 8, 9, 12, 15, 16, 17, 31, 32, 33, 64, 65, 127, 128, 1000];
for (const len of checkLens) {
    for (const pattern of ["mixed", "ones", "zeros"]) {
        const value = makeEncoded(len, pattern);
        assertEqual(original(value), optimized(value), `optimized/${pattern}`, len);
    }
}

assertThrows(() => optimized(new Uint8Array([])), "empty");
assertThrows(() => optimized(new Uint8Array([0x05])), "deceptive");
assertThrows(() => optimized(new Uint8Array([0x08, 0x0F, 0xF0])), "unused > 7");
assertThrows(() => optimized(new Uint8Array([0x03, 0x02])), "trailing set");
assertEqual(original(new Uint8Array([0x03, 0x08])), optimized(new Uint8Array([0x03, 0x08])), "trailing clear", 5);

console.log("correctness: ok");

const sizes = [0, 7, 8, 16, 64, 256, 1024, 8192];
const ITERS = {
    0: 200000,
    7: 200000,
    8: 200000,
    16: 200000,
    64: 100000,
    256: 50000,
    1024: 20000,
    8192: 5000,
};

function bench(fn, value, iters) {
    for (let w = 0; w < 20; w++) fn(value);
    let best = Infinity;
    for (let s = 0; s < 7; s++) {
        const start = performance.now();
        for (let i = 0; i < iters; i++) {
            fn(value);
        }
        const elapsed = performance.now() - start;
        if (elapsed < best) best = elapsed;
    }
    return best;
}

console.log("size".padStart(6), ...Object.keys(impls).map((n) => n.padStart(14)));
for (const size of sizes) {
    const value = makeEncoded(size, "mixed");
    const times = {};
    for (const [name, fn] of Object.entries(impls)) {
        times[name] = bench(fn, value, ITERS[size]);
    }
    const base = times.original;
    console.log(
        String(size).padStart(6),
        ...Object.keys(impls).map((n) => {
            const t = times[n].toFixed(2).padStart(8);
            const speedup = (base / times[n]).toFixed(2) + "x";
            return `${t} ${speedup.padStart(5)}`.padStart(14);
        }),
    );
}
