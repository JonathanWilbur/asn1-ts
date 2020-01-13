import encodeX690BinaryRealNumber from "../../../utils/encodeX690BinaryRealNumber";

/**
 * Only encodes with seven digits of precision.
 * @param value
 */
export default
function encodeReal (value: number): Uint8Array {
    return encodeX690BinaryRealNumber(value);
}
