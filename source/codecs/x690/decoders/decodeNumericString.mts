import isNumericCharacter from "../../../validators/isNumericCharacter.mjs";
import convertBytesToText from "../../../utils/convertBytesToText.mjs";
import { ASN1CharactersError } from "../../../errors.mjs";
import type { NumericString } from "../../../macros.mjs";

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
