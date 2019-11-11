import isPrintableCharacter from "../../../validators/isPrintableCharacter";
import convertTextToBytes from "../../../convertTextToBytes";
import { ASN1CharactersError } from "../../../errors";
import { printableStringCharacters } from "../../../values";

export default
function encodeNumericString (value: string): Uint8Array {
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
