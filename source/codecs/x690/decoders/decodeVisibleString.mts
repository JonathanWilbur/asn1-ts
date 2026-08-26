import isVisibleCharacter from "../../../validators/isVisibleCharacter.mjs";
import convertBytesToText from "../../../utils/convertBytesToText.mjs";
import { ASN1CharactersError } from "../../../errors.mjs";
import type { PrintableString } from "../../../macros.mjs";

export default
function decodePrintableString (value: Uint8Array): PrintableString {
    for (let i = 0; i < value.length; i++) {
        const c = value[i];
        if (!isVisibleCharacter(c)) {
            throw new ASN1CharactersError(
                "VisibleString can only contain characters between 0x20 and 0x7E. "
                + `Encountered character code ${c}.`,
            );
        }
    }
    return convertBytesToText(value);
}
