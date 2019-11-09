import * as errors from "../../../errors";

/**
 * This will assume that the whole `value` encodes one and only one node. If an
 * unset most significant bit (MSB) is encountered within these bytes, it will
 * be ignored, thereby combining two adjacent OID nodes. It is the
 * responsibility of the caller to properly divide the byte stream into nodes.
 *
 * @param value
 */
export default
function decodeObjectIdentifierNode (value: Uint8Array): number {
    if (value.length === 0) {
        throw new errors.ASN1SizeError("OID node cannot be encoded on zero bytes.");
    }
    if (value[value.length - 1] & 0b10000000) {
        throw new errors.ASN1TruncationError("OID node was truncated.");
    }
    let currentNumber: number = 0;
    for (let byteIndex: number = 0; byteIndex < value.length; byteIndex++) {
        if (currentNumber === 0 && value[byteIndex] === 0b10000000) {
            throw new errors.ASN1PaddingError("OID had invalid padding byte.");
        }
        // NOTE: You must use the unsigned shift >>> or MAX_SAFE_INTEGER will become -1
        if (currentNumber > (Number.MAX_SAFE_INTEGER >>> 7)) {
            throw new errors.ASN1OverflowError("OID node too big");
        }
        currentNumber <<= 7;
        currentNumber |= (value[byteIndex] & 0x7F);
    }
    return currentNumber;
}
