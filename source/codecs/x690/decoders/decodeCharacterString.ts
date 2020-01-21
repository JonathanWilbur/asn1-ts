import CharacterString from "../../../types/CharacterString";
import { ASN1TagClass, ASN1UniversalType } from "../../../values";
import ASN1Element from "../../../asn1";
import ConstructedElementSpecification from "../../../ConstructedElementSpecification";
import validateConstruction from "../../../validators/validateConstruction";
import decodeSequence from "../../der/decoders/decodeSequence";

export default
function decodeCharacterString (value: Uint8Array): CharacterString {
    let identification!: ASN1Element;
    let stringValue!: Uint8Array;
    const specification: ConstructedElementSpecification[] = [
        {
            name: "identification",
            optional: false,
            tagClass: ASN1TagClass.context,
            callback: (el: ASN1Element): void => {
                identification = el;
            },
        },
        {
            name: "stringValue",
            optional: true,
            tagClass: ASN1TagClass.universal,
            tagNumber: ASN1UniversalType.octetString,
            callback: (el: ASN1Element): void => {
                stringValue = el.octetString;
            },
        },
    ];
    validateConstruction(decodeSequence(value), specification);
    return new CharacterString(identification, stringValue);
}
