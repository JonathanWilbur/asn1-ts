import isVisibleCharacter from "../../../validators/isVisibleCharacter";
import convertBytesToText from "../../../utils/convertBytesToText";
import { ASN1CharactersError } from "../../../errors";
import { PrintableString } from "../../../macros";

export default
function decodePrintableString (value: Uint8Array): PrintableString {
    value.forEach((characterCode: number): void => {
        if (!isVisibleCharacter(characterCode)) {
            throw new ASN1CharactersError(
                "VisibleString can only contain characters between 0x20 and 0x7E. "
                + `Encountered character code ${characterCode}.`,
            );
        }
    });
    return convertBytesToText(value);
}
