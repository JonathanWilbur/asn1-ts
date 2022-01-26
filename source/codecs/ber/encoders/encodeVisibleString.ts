import isGraphicCharacter from "../../../validators/isGraphicCharacter";
import convertTextToBytes from "../../../utils/convertTextToBytes";
import { ASN1CharactersError } from "../../../errors";
import { VisibleString } from "../../../macros";

export default
function encodeVisibleString (value: VisibleString): Uint8Array {
    const bytes: Uint8Array = convertTextToBytes(value);
    for (const char of bytes) {
        if (!isGraphicCharacter(char)) {
            throw new ASN1CharactersError(
                "VisibleString can only contain characters between 0x20 and 0x7E. "
                + `Encountered character code ${char}.`,
            );
        }
    }
    return bytes;
}
