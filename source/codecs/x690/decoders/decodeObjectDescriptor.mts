import isObjectDescriptorCharacter from "../../../validators/isObjectDescriptorCharacter.mjs";
import convertBytesToText from "../../../utils/convertBytesToText.mjs";
import { ASN1CharactersError } from "../../../errors.mjs";
import type { ObjectDescriptor } from "../../../macros.mjs";

export default
function decodeObjectDescriptor (value: Uint8Array): ObjectDescriptor {
    for (let i = 0; i < value.length; i++) {
        const c = value[i];
        if (!isObjectDescriptorCharacter(c)) {
            throw new ASN1CharactersError(
                "ObjectDescriptor can only contain characters between 0x20 and 0x7E. "
                + `Encountered character code ${c}.`,
            );
        }
    }
    return convertBytesToText(value);
}
