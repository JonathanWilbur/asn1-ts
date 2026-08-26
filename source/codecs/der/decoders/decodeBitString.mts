import * as errors from "../../../errors.mjs";
import type { BIT_STRING } from "../../../macros.mjs";

/**
 * This assumes primitive encoding.
 */
export default
function decodeBitString (value: Uint8Array): BIT_STRING {
    if (value.length === 0) {
        throw new errors.ASN1Error("ASN.1 BIT STRING cannot be encoded on zero bytes!");
    }
    if (value.length === 1 && value[0] !== 0) {
        throw new errors.ASN1Error("ASN.1 BIT STRING encoded with deceptive first byte!");
    }
    const unused: number = value[0];
    if (unused > 7) {
        throw new errors.ASN1Error("First byte of an ASN.1 BIT STRING must be <= 7!");
    }
    if (unused !== 0 && (value[value.length - 1] & ((1 << unused) - 1))) {
        throw new errors.ASN1Error("BIT STRING had a trailing set bit.");
    }

    const bitLen: number = ((value.length - 1) << 3) - unused;
    const ret: Uint8ClampedArray = new Uint8ClampedArray(bitLen);
    const lastFull: number = unused === 0 ? value.length - 1 : value.length - 2;
    let j: number = 0;
    for (let i: number = 1; i <= lastFull; i++, j += 8) {
        const b: number = value[i];
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
        const b: number = value[value.length - 1];
        for (let k: number = 0; j < bitLen; j++, k++) {
            ret[j] = (b >> (7 - k)) & 1;
        }
    }
    return ret;
}
