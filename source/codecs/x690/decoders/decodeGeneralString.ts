import isGeneralCharacter from "../../../validators/isGeneralCharacter";
import convertBytesToText from "../../../utils/convertBytesToText";
import { ASN1CharactersError } from "../../../errors";
import { GeneralString } from "../../../macros";

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
