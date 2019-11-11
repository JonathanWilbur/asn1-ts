import isObjectDescriptorCharacter from "../../../validators/isObjectDescriptorCharacter";
import convertTextToBytes from "../../../convertTextToBytes";
import { ASN1CharactersError } from "../../../errors";

export default
function encodeObjectDescriptor (value: string): Uint8Array {
    const bytes: Uint8Array = convertTextToBytes(value);
    bytes.forEach((characterCode: number): void => {
        if (!isObjectDescriptorCharacter(characterCode)) {
            throw new ASN1CharactersError(
                "ObjectDescriptor can only contain characters between 0x20 and 0x7E. "
                + `Encountered character code ${characterCode}.`,
            );
        }
    });
    return bytes;
}
