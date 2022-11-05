import CharacterString from "../../../types/CharacterString";
import decodeSequence from "../../der/decoders/decodeSequence";
import { ASN1ConstructionError } from "../../../errors";

export default
function decodeCharacterString (value: Uint8Array): CharacterString {
    const components = decodeSequence(value);
    if (components.length !== 2) {
        throw new ASN1ConstructionError(`CharacterString must contain 2 components, not ${components.length}.`);
    }
    const identification = components[0];
    const stringValue = components[1].octetString;
    return new CharacterString(identification, stringValue);
}
