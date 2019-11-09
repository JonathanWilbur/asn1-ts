import { ASN1SpecialRealValue } from "../../../values";
import convertTextToBytes from "../../../convertTextToBytes";

/**
 * Only encodes with seven digits of precision.
 * @param value
 */
export default
function encodeReal (value: number): Uint8Array {
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
