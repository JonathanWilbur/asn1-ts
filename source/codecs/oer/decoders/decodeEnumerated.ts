import decodeBase128 from "../../../utils/decodeBase128";
import decodeSignedBigEndianInteger from "../../../utils/decodeSignedBigEndianInteger";
import { ENUMERATED } from "../../../macros";

export default
function decodeEnumerated (value: Uint8Array): ENUMERATED {
    return decodeSignedBigEndianInteger(decodeBase128(value));
}
