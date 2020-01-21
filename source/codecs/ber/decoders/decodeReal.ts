import * as errors from "../../../errors";
import {
    ASN1SpecialRealValue,
    ASN1RealEncodingBase,
    ASN1RealEncodingScale,
    nr1Regex,
    nr2Regex,
    nr3Regex,
} from "../../../values";
import convertBytesToText from "../../../utils/convertBytesToText";
import { REAL } from "../../../macros";
import decodeUnsignedBigEndianInteger from "../../../utils/decodeUnsignedBigEndianInteger";
import decodeSignedBigEndianInteger from "../../../utils/decodeSignedBigEndianInteger";

export default
function decodeReal (value: Uint8Array): REAL {
    if (value.length === 0) return 0.0;
    switch (value[0] & 0b11000000) {
    case (0b01000000): {
        if (value[0] === ASN1SpecialRealValue.notANumber) return NaN;
        if (value[0] === ASN1SpecialRealValue.minusZero) return -0.0;
        if (value[0] === ASN1SpecialRealValue.plusInfinity) return Infinity;
        if (value[0] === ASN1SpecialRealValue.minusInfinity) return -Infinity;
        throw new errors.ASN1UndefinedError("Unrecognized special REAL value!");
    }
    case (0b00000000): {
        const realString: string = convertBytesToText(value.slice(1));
        switch (value[0] & 0b00111111) {
        case 1: { // NR1
            if (!nr1Regex.test(realString)) throw new errors.ASN1Error("Malformed NR1 Base-10 REAL");
            return Number.parseFloat(realString);
        }
        case 2: { // NR2
            if (!nr2Regex.test(realString)) throw new errors.ASN1Error("Malformed NR2 Base-10 REAL");
            return Number.parseFloat(realString.replace(",", "."));
        }
        case 3: { // NR3
            if (!nr3Regex.test(realString)) throw new errors.ASN1Error("Malformed NR3 Base-10 REAL");
            return Number.parseFloat(realString.replace(",", "."));
        }
        default:
            throw new errors.ASN1UndefinedError("Undefined Base-10 REAL encoding.");
        }
    }
    case (0b10000000):
    case (0b11000000): {
        const sign: number = ((value[0] & 0b01000000) ? -1 : 1);

        const base: number = ((flag: number): number => {
            switch (flag) {
            case (ASN1RealEncodingBase.base2):  return 2;
            case (ASN1RealEncodingBase.base8):  return 8;
            case (ASN1RealEncodingBase.base16): return 16;
            default:
                throw new errors.ASN1Error("Impossible REAL encoding base encountered.");
            }
        })(value[0] & 0b00110000);

        const scale: number = ((flag: number): number => {
            switch (flag) {
            case (ASN1RealEncodingScale.scale0): return 0;
            case (ASN1RealEncodingScale.scale1): return 1;
            case (ASN1RealEncodingScale.scale2): return 2;
            case (ASN1RealEncodingScale.scale3): return 3;
            default:
                throw new errors.ASN1Error("Impossible REAL encoding scale encountered.");
            }
        })(value[0] & 0b00001100);

        let exponent: number;
        let mantissa: number;
        switch (value[0] & 0b00000011) { // Exponent encoding
        case (0b00000000): { // On the following octet
            if (value.length < 3) throw new errors.ASN1TruncationError("Binary-encoded REAL truncated.");
            exponent = decodeSignedBigEndianInteger(value.subarray(1, 2));
            mantissa = decodeUnsignedBigEndianInteger(value.subarray(2));
            break;
        }
        case (0b00000001): { // On the following two octets
            if (value.length < 4) throw new errors.ASN1TruncationError("Binary-encoded REAL truncated.");
            exponent = decodeSignedBigEndianInteger(value.subarray(1, 3));
            mantissa = decodeUnsignedBigEndianInteger(value.subarray(3));
            break;
        }
        case (0b00000010): { // On the following three octets
            if (value.length < 5) throw new errors.ASN1TruncationError("Binary-encoded REAL truncated.");
            exponent = decodeSignedBigEndianInteger(value.subarray(1, 4));
            mantissa = decodeUnsignedBigEndianInteger(value.subarray(4));
            break;
        }
        case (0b00000011): { // Complicated.
            if (value.length < 3) throw new errors.ASN1TruncationError("Binary-encoded REAL truncated.");
            const exponentLength: number = value[1];
            if (value.length < (3 + exponentLength)) {
                throw new errors.ASN1TruncationError("Binary-encoded REAL truncated.");
            }
            exponent = decodeSignedBigEndianInteger(value.subarray(2, (2 + exponentLength)));
            mantissa = decodeUnsignedBigEndianInteger(value.subarray((2 + exponentLength)));
            break;
        }
        default:
            throw new errors.ASN1Error("Impossible binary REAL exponent encoding encountered.");
        }

        return (sign * mantissa * Math.pow(2, scale) * Math.pow(base, exponent));
    }
    default:
        throw new errors.ASN1Error("Impossible REAL format encountered.");
    }
}
