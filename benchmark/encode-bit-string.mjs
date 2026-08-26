function packBits(bits, dest = new Uint8Array((bits.length + 7) >> 3), offset = 0) {
    const len = bits.length;
    const fullBytes = len >> 3;
    const end = offset + fullBytes;
    let i = offset;
    let j = 0;
    for (; i < end; i++, j += 8) {
        dest[i] = (bits[j] << 7)
            | (bits[j + 1] << 6)
            | (bits[j + 2] << 5)
            | (bits[j + 3] << 4)
            | (bits[j + 4] << 3)
            | (bits[j + 5] << 2)
            | (bits[j + 6] << 1)
            | bits[j + 7];
    }
    if (j < len) {
        let byte = 0;
        for (let k = 0; j < len; j++, k++) {
            byte |= bits[j] << (7 - k);
        }
        dest[i] = byte;
    }
    return dest;
}

function encodeCopy(value) {
    if (value.length === 0) {
        return new Uint8Array([0]);
    }
    const ret = new Uint8Array(((value.length >>> 3) + ((value.length % 8) ? 1 : 0)) + 1);
    ret[0] = (8 - (value.length % 8));
    if (ret[0] === 8) {
        ret[0] = 0;
    }
    ret.set(packBits(value), 1);
    return ret;
}

function encodeInPlace(value) {
    const len = value.length;
    const ret = new Uint8Array(((len + 7) >> 3) + 1);
    ret[0] = (8 - (len & 7)) & 7;
    return packBits(value, ret, 1);
}

function makeBits(len, pattern = "mixed") {
    const bits = new Uint8ClampedArray(len);
    if (pattern === "ones") {
        bits.fill(1);
    } else if (pattern === "zeros") {
        bits.fill(0);
    } else {
        for (let i = 0; i < len; i++) {
            bits[i] = (i * 7 + 3) & 1;
        }
    }
    return bits;
}

function assertEqual(a, b, name, len) {
    if (a.length !== b.length) {
        throw new Error(`${name} length mismatch at ${len}: ${a.length} vs ${b.length}`);
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            throw new Error(`${name} mismatch at byte ${i} (len=${len}): ${a[i]} vs ${b[i]}`);
        }
    }
}

const impls = {
    encodeCopy,
    encodeInPlace,
};

const checkLens = [0, 1, 7, 8, 9, 12, 15, 16, 17, 31, 32, 33, 64, 65, 127, 128, 1000];
for (const len of checkLens) {
    for (const pattern of ["mixed", "ones", "zeros"]) {
        const bits = makeBits(len, pattern);
        assertEqual(encodeCopy(bits), encodeInPlace(bits), `encodeInPlace/${pattern}`, len);
    }
}
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

function bench(fn, bits, iters) {
    for (let w = 0; w < 20; w++) fn(bits);
    let best = Infinity;
    for (let s = 0; s < 7; s++) {
        const start = performance.now();
        for (let i = 0; i < iters; i++) {
            fn(bits);
        }
        const elapsed = performance.now() - start;
        if (elapsed < best) best = elapsed;
    }
    return best;
}

console.log("size".padStart(6), ...Object.keys(impls).map((n) => n.padStart(14)));
for (const size of sizes) {
    const bits = makeBits(size, "mixed");
    const times = {};
    for (const [name, fn] of Object.entries(impls)) {
        times[name] = bench(fn, bits, ITERS[size]);
    }
    const base = times.encodeCopy;
    console.log(
        String(size).padStart(6),
        ...Object.keys(impls).map((n) => {
            const t = times[n].toFixed(2).padStart(8);
            const speedup = (base / times[n]).toFixed(2) + "x";
            return `${t} ${speedup.padStart(5)}`.padStart(14);
        }),
    );
}
