import isGeneralCharacter from "../../../validators/isGeneralCharacter.mjs";
import convertBytesToText from "../../../utils/convertBytesToText.mjs";
import { ASN1CharactersError } from "../../../errors.mjs";
import type { GeneralString } from "../../../macros.mjs";

export default
function decodeGeneralString (value: Uint8Array): GeneralString {
    for (let i = 0; i < value.length; i++) {
        const c = value[i];
        if (!isGeneralCharacter(c)) {
            throw new ASN1CharactersError(
                "GeneralString can only contain ASCII characters."
                + `Encountered character code ${c}.`,
            );
        }
    }
    return convertBytesToText(value);
}
