import encodeX690BinaryRealNumber from "../../../utils/encodeX690BinaryRealNumber";
import { REAL } from "../../../macros";

/**
 * Only encodes with seven digits of precision.
 * @param value
 */
export default
function encodeReal (value: REAL): Uint8Array {
    return encodeX690BinaryRealNumber(value);
}
