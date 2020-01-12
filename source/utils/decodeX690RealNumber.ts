import * as errors from "../errors";
import {
    ASN1SpecialRealValue,
    ASN1RealEncodingBase,
    ASN1RealEncodingScale,
    nr1Regex,
    nr2Regex,
    nr3Regex,
} from "../values";
// import ASN1Element from "../asn1";
import convertBytesToText from "../convertBytesToText";
import decodeSignedBigEndianInteger from "../utils/decodeSignedBigEndianInteger";
import decodeUnsignedBigEndianInteger from "../utils/decodeUnsignedBigEndianInteger";

export default
function decodeX690RealNumber (bytes: Uint8Array): number {
    if (bytes.length === 0) return 0.0;
    switch (bytes[0] & 0b11000000) {
    case (0b01000000): {
        if (bytes[0] === ASN1SpecialRealValue.notANumber) return NaN;
        if (bytes[0] === ASN1SpecialRealValue.minusZero) return -0.0;
        if (bytes[0] === ASN1SpecialRealValue.plusInfinity) return Infinity;
        if (bytes[0] === ASN1SpecialRealValue.minusInfinity) return -Infinity;
        throw new errors.ASN1UndefinedError("Unrecognized special REAL value!");
    }
    case (0b00000000): {
        const realString: string = convertBytesToText(bytes.slice(1));
        switch (bytes[0] & 0b00111111) {
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
        const sign: number = ((bytes[0] & 0b01000000) ? -1 : 1);

        const base: number = ((flag: number): number => {
            switch (flag) {
            case (ASN1RealEncodingBase.base2):  return 2;
            case (ASN1RealEncodingBase.base8):  return 8;
            case (ASN1RealEncodingBase.base16): return 16;
            default:
                throw new errors.ASN1Error("Impossible REAL encoding base encountered.");
            }
        })(bytes[0] & 0b00110000);

        const scale: number = ((flag: number): number => {
            switch (flag) {
            case (ASN1RealEncodingScale.scale0): return 0;
            case (ASN1RealEncodingScale.scale1): return 1;
            case (ASN1RealEncodingScale.scale2): return 2;
            case (ASN1RealEncodingScale.scale3): return 3;
            default:
                throw new errors.ASN1Error("Impossible REAL encoding scale encountered.");
            }
        })(bytes[0] & 0b00001100);

        let exponent: number;
        let mantissa: number;
        switch (bytes[0] & 0b00000011) { // Exponent encoding
        case (0b00000000): { // On the following octet
            if (bytes.length < 3) throw new errors.ASN1TruncationError("Binary-encoded REAL truncated.");
            exponent = decodeSignedBigEndianInteger(bytes.subarray(1, 2));
            mantissa = decodeUnsignedBigEndianInteger(bytes.subarray(2));
            break;
        }
        case (0b00000001): { // On the following two octets
            if (bytes.length < 4) throw new errors.ASN1TruncationError("Binary-encoded REAL truncated.");
            exponent = decodeSignedBigEndianInteger(bytes.subarray(1, 3));
            mantissa = decodeUnsignedBigEndianInteger(bytes.subarray(3));
            break;
        }
        case (0b00000010): { // On the following three octets
            if (bytes.length < 5) throw new errors.ASN1TruncationError("Binary-encoded REAL truncated.");
            exponent = decodeSignedBigEndianInteger(bytes.subarray(1, 4));
            mantissa = decodeUnsignedBigEndianInteger(bytes.subarray(4));
            break;
        }
        case (0b00000011): { // Complicated.
            if (bytes.length < 3) throw new errors.ASN1TruncationError("Binary-encoded REAL truncated.");
            const exponentLength: number = bytes[1];
            if (bytes.length < (3 + exponentLength)) {
                throw new errors.ASN1TruncationError("Binary-encoded REAL truncated.");
            }
            exponent = decodeSignedBigEndianInteger(bytes.subarray(2, (2 + exponentLength)));
            mantissa = decodeUnsignedBigEndianInteger(bytes.subarray((2 + exponentLength)));
            break;
        }
        default:
            throw new errors.ASN1Error("Impossible binary REAL exponent encoding encountered.");
        }

        console.log(mantissa);
        console.log(exponent);
        console.log(scale);
        return (sign * mantissa * Math.pow(2, scale) * Math.pow(base, exponent));
    }
    default:
        throw new errors.ASN1Error("Impossible REAL format encountered.");
    }
}
