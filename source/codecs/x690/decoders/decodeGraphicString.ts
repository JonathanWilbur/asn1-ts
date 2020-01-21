import isGraphicCharacter from "../../../validators/isGraphicCharacter";
import convertBytesToText from "../../../utils/convertBytesToText";
import { ASN1CharactersError } from "../../../errors";
import { GraphicString } from "../../../macros";

export default
function decodeGraphicString (value: Uint8Array): GraphicString {
    value.forEach((characterCode: number): void => {
        if (!isGraphicCharacter(characterCode)) {
            throw new ASN1CharactersError(
                "GraphicString can only contain characters between 0x20 and 0x7E. "
                + `Encountered character code ${characterCode}.`,
            );
        }
    });
    return convertBytesToText(value);
}
