import decodeBase128 from "../../../utils/decodeBase128";
import decodeSignedBigEndianInteger from "../../../utils/decodeSignedBigEndianInteger";

export default
function decodeEnumerated (value: Uint8Array): number {
    return decodeSignedBigEndianInteger(decodeBase128(value));
}
