import isPrintableCharacter from "../../../validators/isPrintableCharacter.mjs";
import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";
import { ASN1CharactersError } from "../../../errors.mjs";
import { printableStringCharacters } from "../../../values.mjs";
import { PrintableString } from "../../../macros.mjs";

export default
function encodeNumericString (value: PrintableString): Uint8Array {
    const bytes: Uint8Array = convertTextToBytes(value);
    for (const char of bytes) {
        if (!isPrintableCharacter(char)) {
            throw new ASN1CharactersError(
                `PrintableString can only contain these characters: ${printableStringCharacters}. `
                + `Encountered character code ${char}.`,
            );
        }
    }
    return bytes;
}
