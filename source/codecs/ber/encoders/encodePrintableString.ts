import isPrintableCharacter from "../../../validators/isPrintableCharacter";
import convertTextToBytes from "../../../utils/convertTextToBytes";
import { ASN1CharactersError } from "../../../errors";
import { printableStringCharacters } from "../../../values";
import { PrintableString } from "../../../macros";

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
