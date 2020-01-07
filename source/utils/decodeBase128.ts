import base256Length from "./base256Length";
import getBitFromBase128 from "./getBitFromBase128";
import setBitInBase256 from "./setBitInBase256";

export default
function decodeBase128 (value: Uint8Array): Uint8Array {
    if (value.length === 1 && value[0] < 128) {
        return new Uint8Array([ value[0] ]);
    }
    const decodedBytes: Uint8Array = new Uint8Array(base256Length(value.length));
    for (let byte: number = 0; byte < value.length; byte++) {
        for (let bit: number = 0; bit < 8; bit++) {
            const bitIndex = ((byte << 3) + bit);
            const bitValue = getBitFromBase128(value, bitIndex);
            if (bitValue) {
                setBitInBase256(decodedBytes, bitIndex, true);
            }
        }
    }
    return new Uint8Array(decodedBytes);
}
