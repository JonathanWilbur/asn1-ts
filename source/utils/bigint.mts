import type { INTEGER, SingleThreadBuffer } from "../macros.mjs";
import { MIN_SINT_32, MAX_SINT_32 } from "../values.mjs";
import { Buffer } from "node:buffer";

function bytesToUnsignedBigInt (buf: Buffer): bigint {
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

/**
 * Hex-string `BigInt` parsing beats a JavaScript word loop once the encoding is
 * long enough that native parsing's constant factors win. Below this length,
 * assembling from 64-bit words is faster.
 */
const HEX_BIGINT_THRESHOLD = 24;

const MIN_SINT_40 = -0x80_0000_0000;
const MAX_SINT_40 = 0x7f_ffff_ffff;
const MIN_SINT_48 = -0x80_0000_0000_00;
const MAX_SINT_48 = 0x7f_ffff_ffff_ff;
const MIN_SINT_64 = -0x8000_0000_0000_0000n;
const MAX_SINT_64 = 0x7fff_ffff_ffff_ffffn;

/**
 * Drops leading `00` / `FF` octets that are not needed to preserve the sign bit.
 */
function stripTwosComplementPadding (buf: Buffer<ArrayBuffer>): Buffer<ArrayBuffer> {
    const last = buf.length - 1;
    let start = 0;
    if (buf[0] & 0x80) {
        while (start < last && buf[start] === 0xFF && (buf[start + 1] & 0x80)) {
            start++;
        }
    } else {
        while (start < last && buf[start] === 0x00 && !(buf[start + 1] & 0x80)) {
            start++;
        }
    }
    return start === 0 ? buf : buf.subarray(start);
}

/**
 * Encodes a `number` as a minimal two's-complement INTEGER. Indexed writes beat
 * `writeInt*()` for 1–4 octet values; `writeIntBE` avoids a `BigInt` conversion
 * for 5–6 octets. Remaining finite values fit in 8 octets via `writeBigInt64BE`.
 */
function numberToTwosComplementBuffer (int: number): SingleThreadBuffer {
    if ((int <= 127) && (int >= -128)) {
        const buf = Buffer.allocUnsafe(1);
        buf[0] = int;
        return buf;
    }
    if ((int <= 32767) && (int >= -32768)) {
        const buf = Buffer.allocUnsafe(2);
        buf[0] = int >> 8;
        buf[1] = int;
        return buf;
    }
    if ((int <= 8388607) && (int >= -8388608)) {
        const buf = Buffer.allocUnsafe(3);
        buf[0] = int >> 16;
        buf[1] = int >> 8;
        buf[2] = int;
        return buf;
    }
    if ((int >= MIN_SINT_32) && (int <= MAX_SINT_32)) {
        const buf = Buffer.allocUnsafe(4);
        buf[0] = int >> 24;
        buf[1] = int >> 16;
        buf[2] = int >> 8;
        buf[3] = int;
        return buf;
    }
    if ((int >= MIN_SINT_40) && (int <= MAX_SINT_40)) {
        const buf = Buffer.allocUnsafe(5);
        buf.writeIntBE(int, 0, 5);
        return buf;
    }
    if ((int >= MIN_SINT_48) && (int <= MAX_SINT_48)) {
        const buf = Buffer.allocUnsafe(6);
        buf.writeIntBE(int, 0, 6);
        return buf;
    }
    const ret = Buffer.allocUnsafe(8);
    ret.writeBigInt64BE(BigInt(int));
    return stripTwosComplementPadding(ret);
}

/**
 * Encodes a `bigint` that does not fit in 64-bit two's complement.
 *
 * The magnitude (`n` or `~n`) is converted with native hex formatting, which
 * beats a 64-bit word loop at these sizes. A leading `00` is inserted when the
 * high bit would otherwise look like a sign, then all bits are inverted for
 * negatives — avoiding `asUintN` of a huge fixed width.
 */
function bigintToTwosComplementBuffer (int: bigint): SingleThreadBuffer {
    const negative = int < 0n;
    const magnitude = negative ? ~int : int;
    let hex: string = magnitude.toString(16);
    if (hex.length & 1) {
        hex = `0${hex}`;
    }
    const needSignOctet = (parseInt(hex[0], 16) & 0x8) !== 0;
    let buf: Buffer<ArrayBuffer>;
    if (needSignOctet) {
        buf = Buffer.allocUnsafe((hex.length >> 1) + 1);
        buf[0] = 0x00;
        buf.write(hex, 1, "hex");
    } else {
        buf = Buffer.from(hex, "hex");
    }
    if (negative) {
        for (let i = 0; i < buf.length; i++) {
            buf[i] ^= 0xFF;
        }
    }
    return buf;
}

/**
 * @summary Converts a Buffer or Uint8Array containing a big-endian integer to an ASN.1 `INTEGER` value
 * @description
 * Handles both positive and negative values, supporting arbitrary-length integers as per ASN.1 encoding.
 * Encodings of six octets or fewer are returned as a `number`; longer encodings as a `BigInt`.
 * @param {Buffer|Uint8Array} input - The buffer or byte array containing the big-endian integer.
 * @returns {INTEGER} The decoded ASN.1 `INTEGER` value (number or BigInt).
 * @function
 */
export
function bufferToInteger (input: Buffer | Uint8Array): INTEGER {
    const len = input.length;
    // Direct indexed reads avoid allocating a Buffer view for the common
    // 1–4 octet INTEGER encodings. Lengths through 6 octets (48 bits) fit
    // in a Number; 7+ octets need BigInt.
    switch (len) {
    case 0: return 0;
    case 1: return (input[0] << 24) >> 24;
    case 2: return ((input[0] << 24) >> 16) | input[1];
    case 3: return ((input[0] << 24) >> 8) | (input[1] << 8) | input[2];
    case 4: return (input[0] << 24) | (input[1] << 16) | (input[2] << 8) | input[3];
    }

    const buf = (input instanceof Buffer)
        ? input
        : Buffer.from(input.buffer, input.byteOffset, input.byteLength);
    switch (len) {
    case 5: return buf.readIntBE(0, 5);
    case 6: return buf.readIntBE(0, 6);
    case 8: return buf.readBigInt64BE();
    }

    // Byte assembly is unsigned; ASN.1 INTEGER is two's complement, so a set
    // high bit means subtract 2^(8*len) (same as BigInt.asIntN(8*len, n)).
    const n = (len < HEX_BIGINT_THRESHOLD)
        ? bytesToUnsignedBigInt(buf)
        : BigInt(`0x${buf.toString("hex")}`);
    return (buf[0] & 0x80)
        ? n - (1n << (BigInt(len) << 3n))
        : n;
}

/**
 * @summary Encodes an ASN.1 `INTEGER` value (number or BigInt) into a Buffer in big-endian order
 * @description
 * Handles both positive and negative values, supporting arbitrary-length integers as per ASN.1 encoding.
 * @param {INTEGER} int - The ASN.1 `INTEGER` value to encode.
 * @returns {Buffer} The encoded big-endian buffer
 * @function
 */
export
function integerToBuffer (int: INTEGER): SingleThreadBuffer {
    if (typeof int === "number") {
        return numberToTwosComplementBuffer(int);
    }
    // Safe-range bigints convert exactly to Number and reuse the fast path.
    if (
        (int >= Number.MIN_SAFE_INTEGER)
        && (int <= Number.MAX_SAFE_INTEGER)
    ) {
        return numberToTwosComplementBuffer(Number(int));
    }
    if ((int >= MIN_SINT_64) && (int <= MAX_SINT_64)) {
        const ret = Buffer.allocUnsafe(8);
        ret.writeBigInt64BE(int);
        return stripTwosComplementPadding(ret);
    }
    return bigintToTwosComplementBuffer(int);
}
