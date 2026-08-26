import { ASN1Error } from "../errors.mjs";

export function decodeDec2 (bytes: Uint8Array, offset: number, label: string): number {
    if (offset + 2 > bytes.length) {
        throw new ASN1Error(`Malformed ${label}.`);
    }
    const d0: number = bytes[offset] - 0x30;
    const d1: number = bytes[offset + 1] - 0x30;
    if ((d0 >>> 0) > 9 || (d1 >>> 0) > 9) {
        throw new ASN1Error(`Malformed ${label}.`);
    }
    return (d0 * 10) + d1;
}

export function decodeDec4 (bytes: Uint8Array, offset: number, label: string): number {
    if (offset + 4 > bytes.length) {
        throw new ASN1Error(`Malformed ${label}.`);
    }
    const d0: number = bytes[offset] - 0x30;
    const d1: number = bytes[offset + 1] - 0x30;
    const d2: number = bytes[offset + 2] - 0x30;
    const d3: number = bytes[offset + 3] - 0x30;
    if ((d0 >>> 0) > 9 || (d1 >>> 0) > 9 || (d2 >>> 0) > 9 || (d3 >>> 0) > 9) {
        throw new ASN1Error(`Malformed ${label}.`);
    }
    return (d0 * 1000) + (d1 * 100) + (d2 * 10) + d3;
}

export function decodeFraction (bytes: Uint8Array, start: number, end: number, label: string): number {
    if (end <= start) {
        return 0;
    }
    let n: number = 0;
    let scale: number = 1;
    for (let i: number = start; i < end; i++) {
        const d: number = bytes[i] - 0x30;
        if ((d >>> 0) > 9) {
            throw new ASN1Error(`Malformed ${label}.`);
        }
        n = (n * 10) + d;
        scale *= 10;
    }
    return n / scale;
}

export function writeDec2 (bytes: Uint8Array, offset: number, value: number): void {
    bytes[offset] = 0x30 + ((value / 10) | 0);
    bytes[offset + 1] = 0x30 + (value % 10);
}

export function writeDec4 (bytes: Uint8Array, offset: number, value: number): void {
    bytes[offset] = 0x30 + ((value / 1000) | 0);
    bytes[offset + 1] = 0x30 + (((value / 100) | 0) % 10);
    bytes[offset + 2] = 0x30 + (((value / 10) | 0) % 10);
    bytes[offset + 3] = 0x30 + (value % 10);
}
