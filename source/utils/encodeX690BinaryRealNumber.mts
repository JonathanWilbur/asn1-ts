import dissectFloat from "./dissectFloat.mjs";
import encodeUnsignedBigEndianInteger from "./encodeUnsignedBigEndianInteger.mjs";
import encodeSignedBigEndianInteger from "./encodeSignedBigEndianInteger.mjs";
import { ASN1SpecialRealValue } from "../values.mjs";
import * as errors from "../errors.mjs";
import type { SingleThreadUint8Array } from "../macros.mjs";

/**
 * @summary Encodes a JavaScript number as an ASN.1 `REAL` value using X.690 binary encoding
 * @description
 * Handles special values and normalization as per ITU X.690.
 * @param {number} value - The number to encode.
 * @returns {Uint8Array<ArrayBuffer>} The encoded REAL value bytes.
 * @throws {ASN1OverflowError} If the value is too precise to encode.
 * @function
 */
export default
function encodeX690BinaryRealNumber (value: number): SingleThreadUint8Array {
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
    while (floatComponents.mantissa !== 0 && (floatComponents.mantissa % 2) === 0) {
        floatComponents.mantissa = floatComponents.mantissa >>> 1;
        floatComponents.exponent++;
    }
    if (floatComponents.exponent <= -1020) {
        throw new errors.ASN1OverflowError(
            `REAL number ${value} (having exponent ${floatComponents.exponent}) `
            + "is too precise to encode.",
        );
    }
    const singleByteExponent: boolean = (
        (floatComponents.exponent <= 127)
        && (floatComponents.exponent >= -128)
    );
    const firstByte: number = (
        0b1000_0000
        | (value >= 0 ? 0b0000_0000 : 0b0100_0000)
        | (singleByteExponent ? 0b0000_0000 : 0b0000_0001)
    );
    const exponentBytes = encodeSignedBigEndianInteger(floatComponents.exponent);
    const mantissaBytes = encodeUnsignedBigEndianInteger(floatComponents.mantissa);
    const ret = new Uint8Array(1 + exponentBytes.length + mantissaBytes.length);
    ret[0] = firstByte;
    ret.set(exponentBytes, 1);
    ret.set(mantissaBytes, (1 + exponentBytes.length));
    return ret;
}
