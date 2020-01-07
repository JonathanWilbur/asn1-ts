import { FALSE_BIT } from "../macros";

export default
function packBits (bits: Int8Array): Uint8Array {
    const bytesNeeded: number = Math.ceil(bits.length / 8);
    const ret: Uint8Array = new Uint8Array(bytesNeeded);
    for (let byte: number = 0; byte < ret.length; byte++) {
        for (let bit: number = 0; bit < 8; bit++) {
            if (bits[(byte << 2) + bit] !== FALSE_BIT) {
                ret[byte] |= (0x01 << bit);
            }
        }
    }
    return ret;
}
