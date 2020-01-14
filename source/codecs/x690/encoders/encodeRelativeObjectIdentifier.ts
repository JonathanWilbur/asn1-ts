import concatenateBytes from "../../../utils/concatenateBytes";
import encodeUnsignedBigEndianInteger from "../../../utils/encodeUnsignedBigEndianInteger";
import encodeBase128 from "../../../utils/encodeBase128";
import { RELATIVE_OID } from "../../../macros";

export default
function encodeRelativeObjectIdentifier (value: RELATIVE_OID): Uint8Array {
    return concatenateBytes(value
        .map(encodeUnsignedBigEndianInteger)
        .map(encodeBase128)
        .map((arc: Uint8Array): Uint8Array => ((arc[0] === 0x80) ? arc.slice(1) : arc)),
    );
}
