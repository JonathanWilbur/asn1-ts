import isGeneralCharacter from "../../../validators/isGeneralCharacter";
import convertBytesToText from "../../../convertBytesToText";
import { ASN1CharactersError } from "../../../errors";

export default
function decodeGeneralString (value: Uint8Array): string {
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
