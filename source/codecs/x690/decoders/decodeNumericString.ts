import isNumericCharacter from "../../../validators/isNumericCharacter";
import convertBytesToText from "../../../convertBytesToText";
import { ASN1CharactersError } from "../../../errors";

export default
function decodeNumericString (value: Uint8Array): string {
    value.forEach((characterCode: number): void => {
        if (!isNumericCharacter(characterCode)) {
            throw new ASN1CharactersError(
                "NumericString can only contain characters 0 - 9 and space. "
                + `Encountered character code ${characterCode}.`,
            );
        }
    });
    return convertBytesToText(value);
}
