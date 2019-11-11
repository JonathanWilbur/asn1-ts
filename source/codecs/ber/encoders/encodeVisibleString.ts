import isGraphicCharacter from "../../../validators/isGraphicCharacter";
import convertTextToBytes from "../../../convertTextToBytes";
import { ASN1CharactersError } from "../../../errors";

export default
function encodeVisibleString (value: string): Uint8Array {
    const bytes: Uint8Array = convertTextToBytes(value);
    bytes.forEach((characterCode: number): void => {
        if (!isGraphicCharacter(characterCode)) {
            throw new ASN1CharactersError(
                "VisibleString can only contain characters between 0x20 and 0x7E. "
                + `Encountered character code ${characterCode}.`,
            );
        }
    });
    return bytes;
}
