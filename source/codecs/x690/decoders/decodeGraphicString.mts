import isGraphicCharacter from "../../../validators/isGraphicCharacter.mjs";
import convertBytesToText from "../../../utils/convertBytesToText.mjs";
import { ASN1CharactersError } from "../../../errors.mjs";
import type { GraphicString } from "../../../macros.mjs";

export default
function decodeGraphicString (value: Uint8Array): GraphicString {
    for (let i = 0; i < value.length; i++) {
        const c = value[i];
        if (!isGraphicCharacter(c)) {
            throw new ASN1CharactersError(
                "GraphicString can only contain characters between 0x20 and 0x7E. "
                + `Encountered character code ${c}.`,
            );
        }
    }
    return convertBytesToText(value);
}
