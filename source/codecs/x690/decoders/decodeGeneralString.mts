import isGeneralCharacter from "../../../validators/isGeneralCharacter.mjs";
import convertBytesToText from "../../../utils/convertBytesToText.mjs";
import { ASN1CharactersError } from "../../../errors.mjs";
import type { GeneralString } from "../../../macros.mjs";

export default
function decodeGeneralString (value: Uint8Array): GeneralString {
    for (const char of value) {
        if (!isGeneralCharacter(char)) {
            throw new ASN1CharactersError(
                "GeneralString can only contain ASCII characters."
                + `Encountered character code ${char}.`,
            );
        }
    }
    return convertBytesToText(value);
}
