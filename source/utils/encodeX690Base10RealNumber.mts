import { ASN1SpecialRealValue } from "../values.mjs";
import convertTextToBytes from "./convertTextToBytes.mjs";

/**
 * @summary Encodes a JavaScript number as an ASN.1 `REAL` value using X.690 base-10 (NR3) encoding
 * @description
 * Handles special values as per ITU X.690.
 * @param {number} value - The number to encode.
 * @returns {Uint8Array} The encoded REAL value bytes.
 * @function
 */
export default
function encodeX690Base10RealNumber (value: number): Uint8Array {
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
    const valueString: string = (String.fromCharCode(0b00000011) + value.toFixed(7)); // Encodes as NR3
    return convertTextToBytes(valueString);
}
