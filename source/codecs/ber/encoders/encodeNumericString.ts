import isNumericCharacter from "../../../validators/isNumericCharacter";
import convertTextToBytes from "../../../utils/convertTextToBytes";
import { ASN1CharactersError } from "../../../errors";
import { NumericString } from "../../../macros";

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
