import { EMBEDDED_PDV } from "../../../macros";
import DERElement from "../../../codecs/der";
import { ASN1TagClass, ASN1UniversalType, ASN1Construction } from "../../../values";
import encodeSequence from "./encodeSequence";

// `EmbeddedPDV ::= [UNIVERSAL 11] IMPLICIT SEQUENCE {
//     identification CHOICE {
//         syntaxes SEQUENCE {
//             abstract OBJECT IDENTIFIER,
//             transfer OBJECT IDENTIFIER },
//         syntax OBJECT IDENTIFIER,
//         presentation-context-id INTEGER,
//         context-negotiation SEQUENCE {
//             presentation-context-id INTEGER,
//             transfer-syntax OBJECT IDENTIFIER },
//         transfer-syntax OBJECT IDENTIFIER,
//         fixed NULL },
//     data-value-descriptor ObjectDescriptor OPTIONAL,
//     data-value OCTET STRING }
// (WITH COMPONENTS { ... , data-value-descriptor ABSENT })`
export default
function encodeEmbeddedPDV (value: EMBEDDED_PDV): Uint8Array {
    return encodeSequence([
        value.identification,
        new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.octetString,
            value.dataValue,
        ),
    ]);
}
