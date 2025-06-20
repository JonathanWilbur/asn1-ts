import isPrintableCharacter from "../../../validators/isPrintableCharacter.mjs";
import convertBytesToText from "../../../utils/convertBytesToText.mjs";
import { ASN1CharactersError } from "../../../errors.mjs";
import { printableStringCharacters } from "../../../values.mjs";
import type { PrintableString } from "../../../macros.mjs";

export default
function decodePrintableString (value: Uint8Array): PrintableString {
    for (const char of value) {
        if (!isPrintableCharacter(char)) {
            throw new ASN1CharactersError(
                `PrintableString can only contain these characters: ${printableStringCharacters}. `
                + `Encountered character code ${char}.`,
            );
        }
    }
    return convertBytesToText(value);
}
