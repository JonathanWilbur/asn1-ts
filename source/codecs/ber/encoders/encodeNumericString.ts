import isNumericCharacter from "../../../validators/isNumericCharacter";
import convertTextToBytes from "../../../convertTextToBytes";
import { ASN1CharactersError } from "../../../errors";

export default
function encodeNumericString (value: string): Uint8Array {
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
