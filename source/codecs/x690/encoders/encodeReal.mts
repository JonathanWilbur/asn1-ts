import encodeX690BinaryRealNumber from "../../../utils/encodeX690BinaryRealNumber.mjs";
import type { REAL, SingleThreadUint8Array } from "../../../macros.mjs";

/**
 * Only encodes with seven digits of precision.
 * @param value
 */
export default
function encodeReal (value: REAL): SingleThreadUint8Array {
    return encodeX690BinaryRealNumber(value);
}
