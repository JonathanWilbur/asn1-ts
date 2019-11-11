import isVisibleCharacter from "../../../validators/isVisibleCharacter";
import convertBytesToText from "../../../convertBytesToText";
import { ASN1CharactersError } from "../../../errors";

export default
function decodePrintableString (value: Uint8Array): string {
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
