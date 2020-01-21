import { BIT_STRING, FALSE_BIT } from "../macros";

export default
function packBits (bits: BIT_STRING): Uint8Array {
    const bytesNeeded: number = Math.ceil(bits.length / 8);
    const ret: Uint8Array = new Uint8Array(bytesNeeded);
    for (let bit: number = 0; bit < bits.length; bit++) {
        if (bits[bit] !== FALSE_BIT) {
            const byte: number = Math.floor(bit / 8);
            ret[byte] |= (0x01 << (7 - (bit % 8)));
        }
    }
    return ret;
}
