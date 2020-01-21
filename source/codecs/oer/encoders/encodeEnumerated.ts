import encodeBase128 from "../../../utils/encodeBase128";
import encodeSignedBigEndianInteger from "../../../utils/encodeSignedBigEndianInteger";
import { ENUMERATED } from "../../../macros";

export default
function encodeEnumerated (value: ENUMERATED): Uint8Array {
    return encodeBase128(encodeSignedBigEndianInteger(value));
}
