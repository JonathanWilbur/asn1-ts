import isNumericCharacter from "../../../validators/isNumericCharacter";
import convertBytesToText from "../../../utils/convertBytesToText";
import { ASN1CharactersError } from "../../../errors";
import { NumericString } from "../../../macros";

export default
function decodeNumericString (value: Uint8Array): NumericString {
    for (const char of value) {
        if (!isNumericCharacter(char)) {
            throw new ASN1CharactersError(
                "NumericString can only contain characters 0 - 9 and space. "
                + `Encountered character code ${char}.`,
            );
        }
    }
    return convertBytesToText(value);
}
