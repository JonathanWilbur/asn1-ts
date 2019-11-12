import ObjectIdentifier from "./ObjectIdentifier";
import ASN1Element from "../asn1";

/**
 * How `EXTERNAL` is to be encoded, per X.690:
 *
 * `EXTERNAL ::= [UNIVERSAL 8] IMPLICIT SEQUENCE {
 *     direct-reference OBJECT IDENTIFIER OPTIONAL,
 *     indirect-reference INTEGER OPTIONAL,
 *     data-value-descriptor ObjectDescriptor OPTIONAL,
 *     encoding CHOICE {
 *         single-ASN1-type [0] ABSTRACT-SYNTAX.&Type,
 *         octet-aligned [1] IMPLICIT OCTET STRING,
 *         arbitrary [2] IMPLICIT BIT STRING } }`
 */
export default
class External {
    constructor (
        readonly directReference: ObjectIdentifier | undefined,
        readonly indirectReference: number | undefined,
        readonly dataValueDescriptor: string | undefined,
        readonly encoding: ASN1Element | Uint8Array | boolean[],
    ) {}
}
