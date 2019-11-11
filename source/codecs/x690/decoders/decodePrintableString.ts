import isPrintableCharacter from "../../../validators/isPrintableCharacter";
import convertBytesToText from "../../../convertBytesToText";
import { ASN1CharactersError } from "../../../errors";
import { printableStringCharacters } from "../../../values";

export default
function decodePrintableString (value: Uint8Array): string {
    value.forEach((characterCode: number): void => {
        if (!isPrintableCharacter(characterCode)) {
            throw new ASN1CharactersError(
                `PrintableString can only contain these characters: ${printableStringCharacters}. `
                + `Encountered character code ${characterCode}.`,
            );
        }
    });
    return convertBytesToText(value);
}
