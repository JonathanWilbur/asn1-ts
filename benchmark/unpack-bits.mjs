const TRUE_BIT = 1;

function original(bytes) {
    const ret = new Uint8ClampedArray(bytes.length << 3);
    for (let byte = 0; byte < bytes.length; byte++) {
        for (let bit = 0; bit < 8; bit++) {
            if (bytes[byte] & (0x01 << (7 - bit))) {
                ret[(byte << 3) + bit] = TRUE_BIT;
            }
        }
    }
    return ret;
}

function cachedMask(bytes) {
    const len = bytes.length;
    const ret = new Uint8ClampedArray(len << 3);
    for (let byte = 0; byte < len; byte++) {
        const b = bytes[byte];
        const base = byte << 3;
        for (let bit = 0; bit < 8; bit++) {
            if (b & (0x80 >> bit)) {
                ret[base + bit] = TRUE_BIT;
            }
        }
    }
    return ret;
}

function unrollTernary(bytes) {
    const len = bytes.length;
    const ret = new Uint8ClampedArray(len << 3);
    let j = 0;
    for (let i = 0; i < len; i++, j += 8) {
        const b = bytes[i];
        ret[j]     = (b & 0x80) ? TRUE_BIT : 0;
        ret[j + 1] = (b & 0x40) ? TRUE_BIT : 0;
        ret[j + 2] = (b & 0x20) ? TRUE_BIT : 0;
        ret[j + 3] = (b & 0x10) ? TRUE_BIT : 0;
        ret[j + 4] = (b & 0x08) ? TRUE_BIT : 0;
        ret[j + 5] = (b & 0x04) ? TRUE_BIT : 0;
        ret[j + 6] = (b & 0x02) ? TRUE_BIT : 0;
        ret[j + 7] = (b & 0x01) ? TRUE_BIT : 0;
    }
    return ret;
}

function unrollShift(bytes) {
    const len = bytes.length;
    const ret = new Uint8ClampedArray(len << 3);
    let j = 0;
    for (let i = 0; i < len; i++, j += 8) {
        const b = bytes[i];
        ret[j]     = b >> 7;
        ret[j + 1] = (b >> 6) & 1;
        ret[j + 2] = (b >> 5) & 1;
        ret[j + 3] = (b >> 4) & 1;
        ret[j + 4] = (b >> 3) & 1;
        ret[j + 5] = (b >> 2) & 1;
        ret[j + 6] = (b >> 1) & 1;
        ret[j + 7] = b & 1;
    }
    return ret;
}

function unrollIfSet(bytes) {
    const len = bytes.length;
    const ret = new Uint8ClampedArray(len << 3);
    let j = 0;
    for (let i = 0; i < len; i++, j += 8) {
        const b = bytes[i];
        if (b & 0x80) ret[j] = TRUE_BIT;
        if (b & 0x40) ret[j + 1] = TRUE_BIT;
        if (b & 0x20) ret[j + 2] = TRUE_BIT;
        if (b & 0x10) ret[j + 3] = TRUE_BIT;
        if (b & 0x08) ret[j + 4] = TRUE_BIT;
        if (b & 0x04) ret[j + 5] = TRUE_BIT;
        if (b & 0x02) ret[j + 6] = TRUE_BIT;
        if (b & 0x01) ret[j + 7] = TRUE_BIT;
    }
    return ret;
}

const LOOKUP8 = new Uint8Array(256 << 3);
for (let b = 0; b < 256; b++) {
    const o = b << 3;
    LOOKUP8[o]     = b >> 7;
    LOOKUP8[o + 1] = (b >> 6) & 1;
    LOOKUP8[o + 2] = (b >> 5) & 1;
    LOOKUP8[o + 3] = (b >> 4) & 1;
    LOOKUP8[o + 4] = (b >> 3) & 1;
    LOOKUP8[o + 5] = (b >> 2) & 1;
    LOOKUP8[o + 6] = (b >> 1) & 1;
    LOOKUP8[o + 7] = b & 1;
}

function lookupCopy(bytes) {
    const len = bytes.length;
    const ret = new Uint8ClampedArray(len << 3);
    let j = 0;
    for (let i = 0; i < len; i++, j += 8) {
        const o = bytes[i] << 3;
        ret[j]     = LOOKUP8[o];
        ret[j + 1] = LOOKUP8[o + 1];
        ret[j + 2] = LOOKUP8[o + 2];
        ret[j + 3] = LOOKUP8[o + 3];
        ret[j + 4] = LOOKUP8[o + 4];
        ret[j + 5] = LOOKUP8[o + 5];
        ret[j + 6] = LOOKUP8[o + 6];
        ret[j + 7] = LOOKUP8[o + 7];
    }
    return ret;
}

function lookupSet(bytes) {
    const len = bytes.length;
    const ret = new Uint8ClampedArray(len << 3);
    for (let i = 0; i < len; i++) {
        const o = bytes[i] << 3;
        ret.set(LOOKUP8.subarray(o, o + 8), i << 3);
    }
    return ret;
}

const LOOKUP32 = new Uint32Array(LOOKUP8.buffer);

function lookup32(bytes) {
    const len = bytes.length;
    const ret = new Uint8ClampedArray(len << 3);
    const out = new Uint32Array(ret.buffer);
    for (let i = 0; i < len; i++) {
        const t = bytes[i] << 1;
        const d = i << 1;
        out[d] = LOOKUP32[t];
        out[d + 1] = LOOKUP32[t + 1];
    }
    return ret;
}

function makeBytes(len, pattern = "mixed") {
    const bytes = new Uint8Array(len);
    if (pattern === "ones") {
        bytes.fill(0xff);
    } else if (pattern === "zeros") {
        bytes.fill(0);
    } else if (pattern === "sparse") {
        for (let i = 0; i < len; i++) {
            bytes[i] = (i % 11 === 0) ? 0x80 : 0;
        }
    } else {
        for (let i = 0; i < len; i++) {
            bytes[i] = (i * 47 + 13) & 0xff;
        }
    }
    return bytes;
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

const impls = {
    original,
    cachedMask,
    unrollTernary,
    unrollShift,
    unrollIfSet,
    lookupCopy,
    lookupSet,
    lookup32,
};

const checkLens = [0, 1, 2, 3, 7, 8, 9, 16, 17, 32, 64, 128];
for (const [name, fn] of Object.entries(impls)) {
    if (name === "original") continue;
    for (const len of checkLens) {
        for (const pattern of ["mixed", "ones", "zeros", "sparse"]) {
            const bytes = makeBytes(len, pattern);
            assertEqual(original(bytes), fn(bytes), `${name}/${pattern}`, len);
        }
    }
}
console.log("correctness: ok");

const sizes = [1, 2, 8, 32, 128, 1024];
const ITERS = {
    1: 200000,
    2: 200000,
    8: 100000,
    32: 50000,
    128: 20000,
    1024: 5000,
};

function bench(fn, bytes, iters) {
    for (let w = 0; w < 20; w++) fn(bytes);
    let best = Infinity;
    for (let s = 0; s < 7; s++) {
        const start = performance.now();
        for (let i = 0; i < iters; i++) {
            fn(bytes);
        }
        const elapsed = performance.now() - start;
        if (elapsed < best) best = elapsed;
    }
    return best;
}

function printTable(pattern) {
    console.log(`\npattern: ${pattern}`);
    console.log("size".padStart(6), ...Object.keys(impls).map((n) => n.padStart(14)));
    for (const size of sizes) {
        const bytes = makeBytes(size, pattern);
        const times = {};
        for (const [name, fn] of Object.entries(impls)) {
            times[name] = bench(fn, bytes, ITERS[size]);
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
}

printTable("mixed");
printTable("sparse");
printTable("ones");
