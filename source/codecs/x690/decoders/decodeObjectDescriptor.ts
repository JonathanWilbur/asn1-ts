import isObjectDescriptorCharacter from "../../../validators/isObjectDescriptorCharacter";
import convertBytesToText from "../../../utils/convertBytesToText";
import { ASN1CharactersError } from "../../../errors";
import { ObjectDescriptor } from "../../../macros";

export default
function decodeObjectDescriptor (value: Uint8Array): ObjectDescriptor {
    for (const char of value) {
        if (!isObjectDescriptorCharacter(char)) {
            throw new ASN1CharactersError(
                "ObjectDescriptor can only contain characters between 0x20 and 0x7E. "
                + `Encountered character code ${char}.`,
            );
        }
    }
    return convertBytesToText(value);
}
