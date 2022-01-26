import isObjectDescriptorCharacter from "../../../validators/isObjectDescriptorCharacter";
import convertTextToBytes from "../../../utils/convertTextToBytes";
import { ASN1CharactersError } from "../../../errors";
import { ObjectDescriptor } from "../../../macros";

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
