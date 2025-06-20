import * as errors from "../../../errors.mjs";
import type { BIT_STRING } from "../../../macros.mjs";
import { TRUE_BIT, FALSE_BIT } from "../../../macros.mjs";

export default
function decodeBitString (value: Uint8Array): BIT_STRING {
    if (value.length === 0) {
        throw new errors.ASN1Error("ASN.1 BIT STRING cannot be encoded on zero bytes!");
    }
    if (value.length === 1 && value[0] !== 0) {
        throw new errors.ASN1Error("ASN.1 BIT STRING encoded with deceptive first byte!");
    }
    if (value[0] > 7) {
        throw new errors.ASN1Error("First byte of an ASN.1 BIT STRING must be <= 7!");
    }

    const ret: number[] = [];
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
    ret.length -= value[0];
    return new Uint8ClampedArray(ret);
}
