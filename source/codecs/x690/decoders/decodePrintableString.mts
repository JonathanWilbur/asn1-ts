import isPrintableCharacter from "../../../validators/isPrintableCharacter.mjs";
import convertBytesToText from "../../../utils/convertBytesToText.mjs";
import { ASN1CharactersError } from "../../../errors.mjs";
import { printableStringCharacters } from "../../../values.mjs";
import type { PrintableString } from "../../../macros.mjs";

export default
function decodePrintableString (value: Uint8Array): PrintableString {
    for (let i = 0; i < value.length; i++) {
        const c = value[i];
        if (!isPrintableCharacter(c)) {
            throw new ASN1CharactersError(
                `PrintableString can only contain these characters: ${printableStringCharacters}. `
                + `Encountered character code ${c}.`,
            );
        }
    }
    return convertBytesToText(value);
}
