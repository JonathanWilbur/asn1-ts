import type ASN1Element from "../asn1";

/**
    An `EmbeddedPDV` is a constructed data type, defined in
    the [International Telecommunications Union](https://www.itu.int)'s
    [X.680](https://www.itu.int/rec/T-REC-X.680/en).

    The specification defines `EmbeddedPDV` as:

    `EmbeddedPDV ::= [UNIVERSAL 11] IMPLICIT SEQUENCE {
        identification CHOICE {
            syntaxes SEQUENCE {
                abstract OBJECT IDENTIFIER,
                transfer OBJECT IDENTIFIER },
            syntax OBJECT IDENTIFIER,
            presentation-context-id INTEGER,
            context-negotiation SEQUENCE {
                presentation-context-id INTEGER,
                transfer-syntax OBJECT IDENTIFIER },
            transfer-syntax OBJECT IDENTIFIER,
            fixed NULL },
        data-value-descriptor ObjectDescriptor OPTIONAL,
        data-value OCTET STRING }
    (WITH COMPONENTS { ... , data-value-descriptor ABSENT })`

    This assumes `AUTOMATIC TAGS`, so all of the `identification`
    choices will be `CONTEXT-SPECIFIC` and numbered from 0 to 5.

    The following additional constraints are applied to the abstract syntax
    when using Canonical Encoding Rules or Distinguished Encoding Rules,
    which are also defined in the
    [International Telecommunications Union](https://www.itu.int/en/pages/default.aspx)'s
    [X.690 - ASN.1 encoding rules](http://www.itu.int/rec/T-REC-X.690/en):

    `EmbeddedPDV ( WITH COMPONENTS {
        ... ,
        identification ( WITH COMPONENTS {
            ... ,
            presentation-context-id ABSENT,
            context-negotiation ABSENT } ) } )`

    The stated purpose of the constraints shown above is to restrict the use of
    the `presentation-context-id`, either by itself or within the
    context-negotiation, which makes the following the effective abstract
    syntax of `EmbeddedPDV` when using Canonical Encoding Rules or
    Distinguished Encoding Rules:

    `EmbeddedPDV ::= [UNIVERSAL 11] IMPLICIT SEQUENCE {
        identification CHOICE {
            syntaxes SEQUENCE {
                abstract OBJECT IDENTIFIER,
                transfer OBJECT IDENTIFIER },
            syntax OBJECT IDENTIFIER,
            presentation-context-id INTEGER,
            context-negotiation SEQUENCE {
                presentation-context-id INTEGER,
                transfer-syntax OBJECT IDENTIFIER },
            transfer-syntax OBJECT IDENTIFIER,
            fixed NULL },
        data-value-descriptor ObjectDescriptor OPTIONAL,
        data-value OCTET STRING }
            ( WITH COMPONENTS {
                ... ,
                identification ( WITH COMPONENTS {
                    ... ,
                    presentation-context-id ABSENT,
                    context-negotiation ABSENT } ) } )`

    With the constraints applied, the abstract syntax for `EmbeddedPDV`s encoded
    using Canonical Encoding Rules or Distinguished Encoding Rules becomes:

    `EmbeddedPDV ::= [UNIVERSAL 11] IMPLICIT SEQUENCE {
        identification CHOICE {
            syntaxes SEQUENCE {
                abstract OBJECT IDENTIFIER,
                transfer OBJECT IDENTIFIER },
            syntax OBJECT IDENTIFIER,
            transfer-syntax OBJECT IDENTIFIER,
            fixed NULL },
        data-value-descriptor ObjectDescriptor OPTIONAL,
        data-value OCTET STRING }`
*/
export default
class EmbeddedPDV {
    constructor (
        readonly identification: ASN1Element,
        readonly dataValue: Uint8Array,
    ) {}

    public toString (): string {
        return (
            "EMBEDDED PDV { "
            + `identification ${this.identification.toString()} `
            + `dataValue ${Array.from(this.dataValue).map((byte) => byte.toString(16)).join("")} `
            + "}"
        );
    }

    public toJSON (): unknown {
        return {
            identification: this.identification.toJSON(),
            dataValue: Array.from(this.dataValue).map((byte) => byte.toString(16)).join(""),
        }
    }
}
