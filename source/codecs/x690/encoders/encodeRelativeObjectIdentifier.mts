import type { RELATIVE_OID, SingleThreadUint8Array } from "../../../macros.mjs";
import { Buffer } from "node:buffer";
import * as errors from "../../../errors.mjs";

function encodedArcLength (arc: number): number {
    if (arc < 0x80) {
        return 1;
    }
    if (arc < 0x4000) {
        return 2;
    }
    if (arc < 0x200000) {
        return 3;
    }
    if (arc < 0x10000000) {
        return 4;
    }
    let n: number = 1;
    let v: number = arc;
    while (v >= 0x80) {
        n++;
        v = Math.floor(v / 128);
        if (n > 8) {
            throw new errors.ASN1OverflowError("RELATIVE-OID node too large to encode.");
        }
    }
    return n;
}

function encodedArcsLength (value: ArrayLike<number>, start: number, end: number): number {
    let byteLen: number = 0;
    for (let a: number = start; a < end; a++) {
        byteLen += encodedArcLength(value[a]);
    }
    return byteLen;
}

function writeArc (bytes: Uint8Array, o: number, arc: number): number {
    if (arc < 0x80) {
        bytes[o++] = arc;
    } else if (arc < 0x4000) {
        bytes[o++] = (arc >>> 7) | 0x80;
        bytes[o++] = arc & 0x7F;
    } else if (arc < 0x200000) {
        bytes[o++] = (arc >>> 14) | 0x80;
        bytes[o++] = ((arc >>> 7) & 0x7F) | 0x80;
        bytes[o++] = arc & 0x7F;
    } else if (arc < 0x10000000) {
        bytes[o++] = (arc >>> 21) | 0x80;
        bytes[o++] = ((arc >>> 14) & 0x7F) | 0x80;
        bytes[o++] = ((arc >>> 7) & 0x7F) | 0x80;
        bytes[o++] = arc & 0x7F;
    } else {
        // 5–8 bytes: Number.MAX_SAFE_INTEGER fits in 8 base-128 octets.
        // Avoid `>>>`; it is a 32-bit operator and would truncate here.
        const stack: number[] = [ arc % 128 ];
        let v: number = Math.floor(arc / 128);
        while (v > 0) {
            stack.push((v % 128) | 0x80);
            v = Math.floor(v / 128);
        }
        for (let k: number = stack.length - 1; k >= 0; k--) {
            bytes[o++] = stack[k];
        }
    }
    return o;
}

function writeArcs (
    bytes: Uint8Array,
    o: number,
    value: ArrayLike<number>,
    start: number,
    end: number,
): void {
    for (let a: number = start; a < end; a++) {
        o = writeArc(bytes, o, value[a]);
    }
}

function copyArcs (
    bytes: Uint8Array,
    offset: number,
    value: ArrayLike<number>,
    start: number,
    end: number,
): void {
    for (let a: number = start; a < end; a++) {
        bytes[offset++] = value[a];
    }
}

export default
function encodeRelativeObjectIdentifier (value: RELATIVE_OID): SingleThreadUint8Array {
    const nArcs: number = value.length;
    const byteLen: number = encodedArcsLength(value, 0, nArcs);
    const bytes: SingleThreadUint8Array = Buffer.allocUnsafe(byteLen);
    if (byteLen === nArcs) {
        copyArcs(bytes, 0, value, 0, nArcs);
        return bytes;
    }
    writeArcs(bytes, 0, value, 0, nArcs);
    return bytes;
}

export
function encodeRelativeObjectIdentifierWithPrefix (
    prefix: Uint8Array,
    value: RELATIVE_OID,
): SingleThreadUint8Array {
    const nArcs: number = value.length;
    const suffixLen: number = encodedArcsLength(value, 0, nArcs);
    const bytes: SingleThreadUint8Array = Buffer.allocUnsafe(prefix.length + suffixLen);
    bytes.set(prefix, 0);
    if (suffixLen === nArcs) {
        copyArcs(bytes, prefix.length, value, 0, nArcs);
        return bytes;
    }
    writeArcs(bytes, prefix.length, value, 0, nArcs);
    return bytes;
}

export
function encodeObjectIdentifierFromArcs (
    first: number,
    second: number,
    rest: ArrayLike<number>,
    restStart: number,
): SingleThreadUint8Array {
    const leading: number = (first * 40) + second;
    const end: number = rest.length;
    const restCount: number = end - restStart;
    const byteLen: number = encodedArcLength(leading) + encodedArcsLength(rest, restStart, end);
    const bytes: SingleThreadUint8Array = Buffer.allocUnsafe(byteLen);
    if (byteLen === restCount + 1) {
        bytes[0] = leading;
        copyArcs(bytes, 1, rest, restStart, end);
        return bytes;
    }
    const o: number = writeArc(bytes, 0, leading);
    writeArcs(bytes, o, rest, restStart, end);
    return bytes;
}
