import dissectFloat from "./dissectFloat";
import encodeUnsignedBigEndianInteger from "./encodeUnsignedBigEndianInteger";
import encodeSignedBigEndianInteger from "./encodeSignedBigEndianInteger";
import { ASN1SpecialRealValue } from "../values";

// TODO: Support different base encodings.
export default
function encodeX690BinaryRealNumber (value: number): Uint8Array {
    if (value === 0.0) {
        return new Uint8Array(0);
    } else if (Number.isNaN(value)) {
        return new Uint8Array([ ASN1SpecialRealValue.notANumber ]);
    } else if (value === -0.0) {
        return new Uint8Array([ ASN1SpecialRealValue.minusZero ]);
    } else if (value === Infinity) {
        return new Uint8Array([ ASN1SpecialRealValue.plusInfinity ]);
    } else if (value === -Infinity) {
        return new Uint8Array([ ASN1SpecialRealValue.minusInfinity ]);
    }
    const floatComponents = dissectFloat(value);
    if (floatComponents.mantissa !== 0 && (floatComponents.mantissa % 2) === 0) {
        floatComponents.mantissa >>> 1;
        floatComponents.exponent++;
    }
    const singleByteExponent: boolean = (
        (floatComponents.exponent <= 127)
        && (floatComponents.exponent >= -128)
    );
    const firstByte: number = (
        (value >= 0 ? 0x00 : 0x40)
        | (singleByteExponent ? 0x00 : 0x01)
    );
    const exponentBytes: Uint8Array = singleByteExponent
        ? new Uint8Array([ floatComponents.exponent ])
        : encodeSignedBigEndianInteger(floatComponents.exponent);
    const mantissaBytes: Uint8Array = encodeUnsignedBigEndianInteger(floatComponents.mantissa);
    const ret: Uint8Array = new Uint8Array(1 + exponentBytes.length + mantissaBytes.length);
    ret[0] = firstByte;
    ret.set(exponentBytes, 1);
    ret.set(mantissaBytes, (1 + exponentBytes.length));
    return ret;
}
