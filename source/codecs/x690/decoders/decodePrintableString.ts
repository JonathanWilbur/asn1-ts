import isPrintableCharacter from "../../../validators/isPrintableCharacter";
import convertBytesToText from "../../../utils/convertBytesToText";
import { ASN1CharactersError } from "../../../errors";
import { printableStringCharacters } from "../../../values";
import { PrintableString } from "../../../macros";

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
