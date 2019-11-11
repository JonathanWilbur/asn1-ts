import isObjectDescriptorCharacter from "../../../validators/isObjectDescriptorCharacter";
import convertBytesToText from "../../../convertBytesToText";
import { ASN1CharactersError } from "../../../errors";

export default
function decodeObjectDescriptor (value: Uint8Array): string {
    value.forEach((characterCode: number): void => {
        if (!isObjectDescriptorCharacter(characterCode)) {
            throw new ASN1CharactersError(
                "ObjectDescriptor can only contain characters between 0x20 and 0x7E. "
                + `Encountered character code ${characterCode}.`,
            );
        }
    });
    return convertBytesToText(value);
}
