import type { EMBEDDED_PDV } from "../../../macros.mjs";
import DERElement from "../../../codecs/der.mjs";
import { ASN1TagClass, ASN1UniversalType, ASN1Construction } from "../../../values.mjs";
import encodeSequence from "./encodeSequence.mjs";

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
    const encoding = new DERElement(
        ASN1TagClass.universal,
        ASN1Construction.primitive,
        ASN1UniversalType.octetString,
    );
    encoding.octetString = value.dataValue;
    return encodeSequence([
        value.identification,
        encoding,
    ]);
}
