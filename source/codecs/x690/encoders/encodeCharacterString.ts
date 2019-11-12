import CharacterString from "../../../types/CharacterString";
import DERElement from "../../../codecs/der";
import { ASN1TagClass, ASN1UniversalType, ASN1Construction } from "../../../values";
import encodeSequence from "./encodeSequence";

export default
function encodeCharacterString (value: CharacterString): Uint8Array {
    return encodeSequence([
        value.identification,
        new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.octetString,
            value.stringValue,
        ),
    ]);
}
