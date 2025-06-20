import isObjectDescriptorCharacter from "../../../validators/isObjectDescriptorCharacter.mjs";
import convertTextToBytes from "../../../utils/convertTextToBytes.mjs";
import { ASN1CharactersError } from "../../../errors.mjs";
import type { ObjectDescriptor } from "../../../macros.mjs";

export default
function encodeObjectDescriptor (value: ObjectDescriptor): Uint8Array {
    const bytes: Uint8Array = convertTextToBytes(value);
    for (const char of bytes) {
        if (!isObjectDescriptorCharacter(char)) {
            throw new ASN1CharactersError(
                "ObjectDescriptor can only contain characters between 0x20 and 0x7E. "
                + `Encountered character code ${char}.`,
            );
        }
    }
    return bytes;
}
