import { BIT_STRING, FALSE_BIT } from "../macros.mjs";

export default
function packBits (bits: BIT_STRING): Uint8Array {
    const bytesNeeded: number = Math.ceil(bits.length / 8);
    const ret: Uint8Array = new Uint8Array(bytesNeeded);
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
