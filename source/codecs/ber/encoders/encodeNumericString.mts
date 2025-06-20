import isNumericCharacter from "../../../validators/isNumericCharacter.mjs";
import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";
import { ASN1CharactersError } from "../../../errors.mjs";
import type { NumericString } from "../../../macros.mjs";

export default
function encodeNumericString (value: NumericString): Uint8Array {
    const bytes: Uint8Array = convertTextToBytes(value);
    for (const char of bytes) {
        if (!isNumericCharacter(char)) {
            throw new ASN1CharactersError(
                "NumericString can only contain characters 0 - 9 and space. "
                + `Encountered character code ${char}.`,
            );
        }
    }
    return bytes;
}
