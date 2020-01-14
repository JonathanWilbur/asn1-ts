import isPrintableCharacter from "../../../validators/isPrintableCharacter";
import convertTextToBytes from "../../../utils/convertTextToBytes";
import { ASN1CharactersError } from "../../../errors";
import { printableStringCharacters } from "../../../values";
import { PrintableString } from "../../../macros";

export default
function encodeNumericString (value: PrintableString): Uint8Array {
    const bytes: Uint8Array = convertTextToBytes(value);
    bytes.forEach((characterCode: number): void => {
        if (!isPrintableCharacter(characterCode)) {
            throw new ASN1CharactersError(
                `PrintableString can only contain these characters: ${printableStringCharacters}. `
                + `Encountered character code ${characterCode}.`,
            );
        }
    });
    return bytes;
}
