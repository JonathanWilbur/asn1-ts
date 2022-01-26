import isGraphicCharacter from "../../../validators/isGraphicCharacter";
import convertBytesToText from "../../../utils/convertBytesToText";
import { ASN1CharactersError } from "../../../errors";
import { GraphicString } from "../../../macros";

export default
function decodeGraphicString (value: Uint8Array): GraphicString {
    for (const char of value) {
        if (!isGraphicCharacter(char)) {
            throw new ASN1CharactersError(
                "GraphicString can only contain characters between 0x20 and 0x7E. "
                + `Encountered character code ${char}.`,
            );
        }
    }
    return convertBytesToText(value);
}
