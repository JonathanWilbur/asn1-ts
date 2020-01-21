import isNumericCharacter from "../../../validators/isNumericCharacter";
import convertTextToBytes from "../../../utils/convertTextToBytes";
import { ASN1CharactersError } from "../../../errors";
import { NumericString } from "../../../macros";

export default
function encodeNumericString (value: NumericString): Uint8Array {
    const bytes: Uint8Array = convertTextToBytes(value);
    bytes.forEach((characterCode: number): void => {
        if (!isNumericCharacter(characterCode)) {
            throw new ASN1CharactersError(
                "NumericString can only contain characters 0 - 9 and space. "
                + `Encountered character code ${characterCode}.`,
            );
        }
    });
    return bytes;
}
