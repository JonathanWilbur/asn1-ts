import EmbeddedPDV from "../../../types/EmbeddedPDV";
import { ASN1TagClass, ASN1UniversalType } from "../../../values";
import ASN1Element from "../../../asn1";
import ConstructedElementSpecification from "../../../ConstructedElementSpecification";
import validateConstruction from "../../../validators/validateConstruction";
import decodeSequence from "../../der/decoders/decodeSequence";
import { EMBEDDED_PDV } from "../../../macros";

export default
function decodeEmbeddedPDV (value: Uint8Array): EMBEDDED_PDV {
    let identification!: ASN1Element;
    let dataValue!: Uint8Array;
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
            name: "dataValue",
            optional: true,
            tagClass: ASN1TagClass.universal,
            tagNumber: ASN1UniversalType.octetString,
            callback: (el: ASN1Element): void => {
                dataValue = el.octetString;
            },
        },
    ];
    validateConstruction(decodeSequence(value), specification);
    return new EmbeddedPDV(identification, dataValue);
}
