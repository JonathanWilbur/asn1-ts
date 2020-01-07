import encodeBase128 from "../../../utils/encodeBase128";
import encodeSignedBigEndianInteger from "../../../utils/encodeSignedBigEndianInteger";

export default
function encodeEnumerated (value: number): Uint8Array {
    return encodeBase128(encodeSignedBigEndianInteger(value));
}
