import isGeneralCharacter from "../../../validators/isGeneralCharacter";
import convertTextToBytes from "../../../convertTextToBytes";
import { ASN1CharactersError } from "../../../errors";

export default
function encodeGeneralString (value: string): Uint8Array {
    const bytes: Uint8Array = convertTextToBytes(value);
    bytes.forEach((characterCode: number): void => {
        if (!isGeneralCharacter(characterCode)) {
            throw new ASN1CharactersError(
                "GeneralString can only contain ASCII characters."
                + `Encountered character code ${characterCode}.`,
            );
        }
    });
    return bytes;
}
