import isObjectDescriptorCharacter from "../../../validators/isObjectDescriptorCharacter";
import convertBytesToText from "../../../utils/convertBytesToText";
import { ASN1CharactersError } from "../../../errors";
import { ObjectDescriptor } from "../../../macros";

export default
function decodeObjectDescriptor (value: Uint8Array): ObjectDescriptor {
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
