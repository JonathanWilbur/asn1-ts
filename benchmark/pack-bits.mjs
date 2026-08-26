const FALSE_BIT = 0;

function original(bits) {
    const bytesNeeded = Math.ceil(bits.length / 8);
    const ret = new Uint8Array(bytesNeeded);
    let byte = -1;
    for (let bit = 0; bit < bits.length; bit++) {
        const bitMod8 = bit % 8;
        if (bitMod8 === 0) {
            byte++;
        }
        if (bits[bit] !== FALSE_BIT) {
            ret[byte] |= (0x01 << (7 - bitMod8));
        }
    }
    return ret;
}

function and7(bits) {
    const len = bits.length;
    const ret = new Uint8Array((len + 7) >> 3);
    for (let bit = 0; bit < len; bit++) {
        if (bits[bit] !== FALSE_BIT) {
            ret[bit >> 3] |= 0x80 >> (bit & 7);
        }
    }
    return ret;
}

function unrollShift(bits) {
    const len = bits.length;
    const ret = new Uint8Array((len + 7) >> 3);
    const fullBytes = len >> 3;
    let i = 0;
    let j = 0;
    for (; i < fullBytes; i++, j += 8) {
        ret[i] = (bits[j] << 7)
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
        ret[i] = byte;
    }
    return ret;
}

function unrollBool(bits) {
    const len = bits.length;
    const ret = new Uint8Array((len + 7) >> 3);
    const fullBytes = len >> 3;
    let i = 0;
    let j = 0;
    for (; i < fullBytes; i++, j += 8) {
        ret[i] = ((bits[j] !== 0) << 7)
            | ((bits[j + 1] !== 0) << 6)
            | ((bits[j + 2] !== 0) << 5)
            | ((bits[j + 3] !== 0) << 4)
            | ((bits[j + 4] !== 0) << 3)
            | ((bits[j + 5] !== 0) << 2)
            | ((bits[j + 6] !== 0) << 1)
            | (bits[j + 7] !== 0);
    }
    if (j < len) {
        let byte = 0;
        for (let k = 0; j < len; j++, k++) {
            byte |= (bits[j] !== 0) << (7 - k);
        }
        ret[i] = byte;
    }
    return ret;
}

function unrollAndMask(bits) {
    const len = bits.length;
    const ret = new Uint8Array((len + 7) >> 3);
    const fullBytes = len >> 3;
    let i = 0;
    let j = 0;
    for (; i < fullBytes; i++, j += 8) {
        ret[i] = (bits[j] && 0x80)
            | (bits[j + 1] && 0x40)
            | (bits[j + 2] && 0x20)
            | (bits[j + 3] && 0x10)
            | (bits[j + 4] && 0x08)
            | (bits[j + 5] && 0x04)
            | (bits[j + 6] && 0x02)
            | (bits[j + 7] && 0x01);
    }
    if (j < len) {
        let byte = 0;
        let mask = 0x80;
        for (; j < len; j++, mask >>= 1) {
            if (bits[j]) byte |= mask;
        }
        ret[i] = byte;
    }
    return ret;
}

function unroll4x(bits) {
    const len = bits.length;
    const ret = new Uint8Array((len + 7) >> 3);
    const fullBytes = len >> 3;
    const unroll = fullBytes & ~3;
    let i = 0;
    let j = 0;
    for (; i < unroll; i += 4, j += 32) {
        ret[i] = (bits[j] << 7) | (bits[j + 1] << 6) | (bits[j + 2] << 5) | (bits[j + 3] << 4)
            | (bits[j + 4] << 3) | (bits[j + 5] << 2) | (bits[j + 6] << 1) | bits[j + 7];
        ret[i + 1] = (bits[j + 8] << 7) | (bits[j + 9] << 6) | (bits[j + 10] << 5) | (bits[j + 11] << 4)
            | (bits[j + 12] << 3) | (bits[j + 13] << 2) | (bits[j + 14] << 1) | bits[j + 15];
        ret[i + 2] = (bits[j + 16] << 7) | (bits[j + 17] << 6) | (bits[j + 18] << 5) | (bits[j + 19] << 4)
            | (bits[j + 20] << 3) | (bits[j + 21] << 2) | (bits[j + 22] << 1) | bits[j + 23];
        ret[i + 3] = (bits[j + 24] << 7) | (bits[j + 25] << 6) | (bits[j + 26] << 5) | (bits[j + 27] << 4)
            | (bits[j + 28] << 3) | (bits[j + 29] << 2) | (bits[j + 30] << 1) | bits[j + 31];
    }
    for (; i < fullBytes; i++, j += 8) {
        ret[i] = (bits[j] << 7) | (bits[j + 1] << 6) | (bits[j + 2] << 5) | (bits[j + 3] << 4)
            | (bits[j + 4] << 3) | (bits[j + 5] << 2) | (bits[j + 6] << 1) | bits[j + 7];
    }
    if (j < len) {
        let byte = 0;
        for (let k = 0; j < len; j++, k++) {
            byte |= bits[j] << (7 - k);
        }
        ret[i] = byte;
    }
    return ret;
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
    original,
    and7,
    unrollShift,
    unrollBool,
    unrollAndMask,
    unroll4x,
};

const checkLens = [0, 1, 7, 8, 9, 12, 15, 16, 17, 31, 32, 33, 64, 65, 127, 128, 1000];
for (const [name, fn] of Object.entries(impls)) {
    if (name === "original") continue;
    for (const len of checkLens) {
        for (const pattern of ["mixed", "ones", "zeros"]) {
            const bits = makeBits(len, pattern);
            assertEqual(original(bits), fn(bits), `${name}/${pattern}`, len);
        }
    }
}
console.log("correctness: ok");

const sizes = [7, 8, 16, 64, 256, 1024, 8192];
const ITERS = {
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
