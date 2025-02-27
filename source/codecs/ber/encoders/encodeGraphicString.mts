import isGraphicCharacter from "../../../validators/isGraphicCharacter.mjs";
import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";
import { ASN1CharactersError } from "../../../errors.mjs";
import { GraphicString } from "../../../macros.mjs";

export default
function encodeGraphicString (value: GraphicString): Uint8Array {
    const bytes: Uint8Array = convertTextToBytes(value);
    for (const char of bytes) {
        if (!isGraphicCharacter(char)) {
            throw new ASN1CharactersError(
                "GraphicString can only contain characters between 0x20 and 0x7E. "
                + `Encountered character code ${char}.`,
            );
        }
    }
    return bytes;
}
