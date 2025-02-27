import type ASN1Element from "../asn1.mjs";

/**
    A `CharacterString`, is a constructed data type, defined
    in the [International Telecommunications Union](https://www.itu.int)'s
    [X.680](https://www.itu.int/rec/T-REC-X.680/en).
    The specification defines `CharacterString` as:

    `CHARACTER STRING ::= [UNIVERSAL 29] SEQUENCE {
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
        string-value OCTET STRING }`

    This assumes `AUTOMATIC TAGS`, so all of the `identification`
    choices will be `CONTEXT-SPECIFIC` and numbered from 0 to 5.
 */
export default
class CharacterString {
    constructor (
        readonly identification: ASN1Element,
        readonly stringValue: Uint8Array,
    ) {}

    public toString (): string {
        return (
            "CHARACTER STRING { "
            + `identification ${this.identification.toString()} `
            + `dataValue ${Array.from(this.stringValue).map((byte) => byte.toString(16)).join("")} `
            + "}"
        );
    }

    public toJSON (): unknown {
        return {
            identification: this.identification.toJSON(),
            dataValue: Array.from(this.stringValue).map((byte) => byte.toString(16)).join(""),
        }
    }
}
