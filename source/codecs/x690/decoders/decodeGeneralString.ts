import isGeneralCharacter from "../../../validators/isGeneralCharacter";
import convertBytesToText from "../../../utils/convertBytesToText";
import { ASN1CharactersError } from "../../../errors";
import { GeneralString } from "../../../macros";

export default
function decodeGeneralString (value: Uint8Array): GeneralString {
    value.forEach((characterCode: number): void => {
        if (!isGeneralCharacter(characterCode)) {
            throw new ASN1CharactersError(
                "GeneralString can only contain ASCII characters."
                + `Encountered character code ${characterCode}.`,
            );
        }
    });
    return convertBytesToText(value);
}
