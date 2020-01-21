import base128Length from "./base128Length";
import getBitFromBase256 from "./getBitFromBase256";
import setBitInBase128 from "./setBitInBase128";

export default
function encodeBase128 (value: Uint8Array): Uint8Array {
    if (value.length === 1 && value[0] < 128) {
        return new Uint8Array([ value[0] ]);
    }
    const encodedBytes: Uint8Array = new Uint8Array(base128Length(value.length));
    for (let byte = 0; byte < value.length; byte++) {
        for (let bit = 0; bit < 8; bit++) {
            const bitIndex = ((byte << 3) + bit);
            const bitValue = getBitFromBase256(value, bitIndex);
            if (bitValue) {
                setBitInBase128(encodedBytes, bitIndex, true);
            }
        }
    }
    for (let byte = 0; byte < (encodedBytes.length - 1); byte++) {
        encodedBytes[byte] |= 0x80;
    }
    return new Uint8Array(encodedBytes);
}
