import isVisibleCharacter from "../../../validators/isVisibleCharacter.mjs";
import convertBytesToText from "../../../utils/convertBytesToText.mjs";
import { ASN1CharactersError } from "../../../errors.mjs";
import { PrintableString } from "../../../macros.mjs";

export default
function decodePrintableString (value: Uint8Array): PrintableString {
    for (const char of value) {
        if (!isVisibleCharacter(char)) {
            throw new ASN1CharactersError(
                "VisibleString can only contain characters between 0x20 and 0x7E. "
                + `Encountered character code ${char}.`,
            );
        }
    }
    return convertBytesToText(value);
}
