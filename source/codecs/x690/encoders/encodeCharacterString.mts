import CharacterString from "../../../types/CharacterString.mjs";
import DERElement from "../../../codecs/der.mjs";
import { ASN1TagClass, ASN1UniversalType, ASN1Construction } from "../../../values.mjs";
import encodeSequence from "./encodeSequence.mjs";

export default
function encodeCharacterString (value: CharacterString): Uint8Array {
    const encoding = new DERElement(
        ASN1TagClass.universal,
        ASN1Construction.primitive,
        ASN1UniversalType.octetString,
    );
    encoding.octetString = value.stringValue;
    return encodeSequence([
        value.identification,
        encoding,
    ]);
}
