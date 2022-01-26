import isGeneralCharacter from "../../../validators/isGeneralCharacter";
import convertTextToBytes from "../../../utils/convertTextToBytes";
import { ASN1CharactersError } from "../../../errors";
import { GeneralString } from "../../../macros";

export default
function encodeGeneralString (value: GeneralString): Uint8Array {
    const bytes: Uint8Array = convertTextToBytes(value);
    for (const char of bytes) {
        if (!isGeneralCharacter(char)) {
            throw new ASN1CharactersError(
                "GeneralString can only contain ASCII characters."
                + `Encountered character code ${char}.`,
            );
        }
    }
    return bytes;
}
