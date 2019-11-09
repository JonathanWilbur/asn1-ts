import * as errors from "../../../errors";

/**
 * This assumes primitive encoding.
 */
export default
function decodeBitString (value: Uint8Array): boolean[] {
    if (value.length === 0) {
        throw new errors.ASN1Error("ASN.1 BIT STRING cannot be encoded on zero bytes!");
    }
    if (value.length === 1 && value[0] !== 0) {
        throw new errors.ASN1Error("ASN.1 BIT STRING encoded with deceptive first byte!");
    }
    if (value[0] > 7) {
        throw new errors.ASN1Error("First byte of an ASN.1 BIT STRING must be <= 7!");
    }

    let ret: boolean[] = [];
    for (let i = 1; i < value.length; i++) {
        ret = ret.concat([
            (Boolean(value[i] & 0b10000000)),
            (Boolean(value[i] & 0b01000000)),
            (Boolean(value[i] & 0b00100000)),
            (Boolean(value[i] & 0b00010000)),
            (Boolean(value[i] & 0b00001000)),
            (Boolean(value[i] & 0b00000100)),
            (Boolean(value[i] & 0b00000010)),
            (Boolean(value[i] & 0b00000001)),
        ]);
    }
    ret.slice((ret.length - value[0])).forEach((bit) => {
        if (bit) throw new errors.ASN1Error("BIT STRING had a trailing set bit.");
    });
    ret.length -= value[0];
    return ret;
}
