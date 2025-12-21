import type { BIT_STRING, SingleThreadUint8Array } from "../macros.mjs";
import { FALSE_BIT } from "../macros.mjs";

/**
 * @summary Packs a `BIT STRING` into a `Uint8Array`
 * @description
 * Used for ASN.1 `BIT STRING` encoding.
 * @param {BIT_STRING} bits - The bit string to pack.
 * @returns {Uint8Array} The packed bytes.
 * @function
 */
export default
function packBits (bits: BIT_STRING): SingleThreadUint8Array {
    const bytesNeeded: number = Math.ceil(bits.length / 8);
    const ret = new Uint8Array(bytesNeeded);
    let byte = -1;
    for (let bit: number = 0; bit < bits.length; bit++) {
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
