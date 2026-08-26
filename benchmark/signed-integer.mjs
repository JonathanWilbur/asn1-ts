import { Buffer } from "node:buffer";

function current(value) {
    if (value <= 127 && value >= -128) {
        return new Uint8Array([(value & 255)]);
    } else if (value <= 32767 && value >= -32768) {
        return new Uint8Array([((value >> 8) & 255), (value & 255)]);
    } else if (value <= 8388607 && value >= -8388608) {
        return new Uint8Array([((value >> 16) & 255), ((value >> 8) & 255), (value & 255)]);
    } else {
        return new Uint8Array([((value >> 24) & 255), ((value >> 16) & 255), ((value >> 8) & 255), (value & 255)]);
    }
}

function indexed(value) {
    if (value <= 127 && value >= -128) {
        const out = new Uint8Array(1);
        out[0] = value;
        return out;
    } else if (value <= 32767 && value >= -32768) {
        const out = new Uint8Array(2);
        out[0] = value >> 8;
        out[1] = value;
        return out;
    } else if (value <= 8388607 && value >= -8388608) {
        const out = new Uint8Array(3);
        out[0] = value >> 16;
        out[1] = value >> 8;
        out[2] = value;
        return out;
    } else {
        const out = new Uint8Array(4);
        out[0] = value >> 24;
        out[1] = value >> 16;
        out[2] = value >> 8;
        out[3] = value;
        return out;
    }
}

function bufUnsafe(value) {
    if (value <= 127 && value >= -128) {
        const out = Buffer.allocUnsafe(1);
        out.writeInt8(value);
        return out;
    } else if (value <= 32767 && value >= -32768) {
        const out = Buffer.allocUnsafe(2);
        out.writeInt16BE(value);
        return out;
    } else if (value <= 8388607 && value >= -8388608) {
        const out = Buffer.allocUnsafe(4);
        out.writeInt32BE(value);
        return out.subarray(1);
    } else {
        const out = Buffer.allocUnsafe(4);
        out.writeInt32BE(value);
        return out;
    }
}

function bufSet(value) {
    if (value <= 127 && value >= -128) {
        const out = Buffer.allocUnsafe(1);
        out[0] = value;
        return out;
    } else if (value <= 32767 && value >= -32768) {
        const out = Buffer.allocUnsafe(2);
        out[0] = value >> 8;
        out[1] = value;
        return out;
    } else if (value <= 8388607 && value >= -8388608) {
        const out = Buffer.allocUnsafe(3);
        out[0] = value >> 16;
        out[1] = value >> 8;
        out[2] = value;
        return out;
    } else {
        const out = Buffer.allocUnsafe(4);
        out[0] = value >> 24;
        out[1] = value >> 16;
        out[2] = value >> 8;
        out[3] = value;
        return out;
    }
}

function always4strip(value) {
    const out = Buffer.allocUnsafe(4);
    out.writeInt32BE(value | 0);
    let i = 0;
    if (value >= 0) {
        while (i < 3 && out[i] === 0x00 && !(out[i + 1] & 0x80)) i++;
    } else {
        while (i < 3 && out[i] === 0xFF && (out[i + 1] & 0x80)) i++;
    }
    return out.subarray(i);
}

function clzIndexed(value) {
    value |= 0;
    const mag = value < 0 ? ~value : value;
    const len = ((32 - Math.clz32(mag)) >> 3) + 1;
    const out = new Uint8Array(len);
    if (len === 1) {
        out[0] = value;
    } else if (len === 2) {
        out[0] = value >> 8;
        out[1] = value;
    } else if (len === 3) {
        out[0] = value >> 16;
        out[1] = value >> 8;
        out[2] = value;
    } else {
        out[0] = value >> 24;
        out[1] = value >> 16;
        out[2] = value >> 8;
        out[3] = value;
    }
    return out;
}

function clzBuf(value) {
    value |= 0;
    const mag = value < 0 ? ~value : value;
    const len = ((32 - Math.clz32(mag)) >> 3) + 1;
    const out = Buffer.allocUnsafe(len);
    if (len === 1) {
        out[0] = value;
    } else if (len === 2) {
        out[0] = value >> 8;
        out[1] = value;
    } else if (len === 3) {
        out[0] = value >> 16;
        out[1] = value >> 8;
        out[2] = value;
    } else {
        out[0] = value >> 24;
        out[1] = value >> 16;
        out[2] = value >> 8;
        out[3] = value;
    }
    return out;
}

function dataview(value) {
    if (value <= 127 && value >= -128) {
        const buf = new ArrayBuffer(1);
        new DataView(buf).setInt8(0, value);
        return new Uint8Array(buf);
    } else if (value <= 32767 && value >= -32768) {
        const buf = new ArrayBuffer(2);
        new DataView(buf).setInt16(0, value);
        return new Uint8Array(buf);
    } else if (value <= 8388607 && value >= -8388608) {
        const buf = new ArrayBuffer(4);
        new DataView(buf).setInt32(0, value);
        return new Uint8Array(buf, 1, 3);
    } else {
        const buf = new ArrayBuffer(4);
        new DataView(buf).setInt32(0, value);
        return new Uint8Array(buf);
    }
}

const cases = {
    "1-byte mixed": [0, 1, -1, 127, -128, 42, -42, 100, -100, 7],
    "2-byte mixed": [128, -129, 511, 32767, -32768, 1000, -1000, 20000],
    "4-byte mixed": [8388608, -8388609, 2147483647, -2147483648, 100000000],
    "realistic mix": [0, 1, -1, 2, 3, 10, 127, 128, 255, 256, -128, -129, 1000, 65535, 100000],
};

function eq(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
}

const impls = { current, indexed, bufUnsafe, bufSet, always4strip, clzIndexed, clzBuf, dataview };

for (const [name, fn] of Object.entries(impls)) {
    if (name === "current") continue;
    for (let v = -200000; v <= 200000; v += 17) {
        if (!eq(current(v), fn(v))) {
            console.log("MISMATCH", name, v, [...current(v)], [...fn(v)]);
            throw new Error("mismatch");
        }
    }
    for (const v of [0, -1, 127, 128, -128, -129, 32767, 32768, -32768, -32769, 8388607, 8388608, -8388608, -8388609, 2147483647, -2147483648]) {
        if (!eq(current(v), fn(v))) {
            console.log("MISMATCH", name, v, [...current(v)], [...fn(v)]);
            throw new Error("mismatch");
        }
    }
}
console.log("all match current\n");

function bench(fn, values) {
    for (let i = 0; i < 20000; i++) fn(values[i % values.length]);
    const n = 2_000_000;
    const t0 = performance.now();
    for (let i = 0; i < n; i++) fn(values[i % values.length]);
    const t1 = performance.now();
    return ((t1 - t0) / n) * 1e6;
}

for (const [cname, values] of Object.entries(cases)) {
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
