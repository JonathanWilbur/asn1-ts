import type ASN1Element from "../asn1.mjs";
import { formatOctetStringValue, identificationToJSON, stringifyIdentification } from "../utils/asn1ValueNotation.mjs";

/**
 * A `CharacterString`, is a constructed data type, defined
 * in the [International Telecommunications Union](https://www.itu.int)'s
 * [X.680](https://www.itu.int/rec/T-REC-X.680/en).
 * The specification defines `CharacterString` as:
 * 
 * ```asn1
 * CHARACTER STRING ::= [UNIVERSAL 29] SEQUENCE {
 *     identification CHOICE {
 *         syntaxes SEQUENCE {
 *             abstract OBJECT IDENTIFIER,
 *             transfer OBJECT IDENTIFIER },
 *         syntax OBJECT IDENTIFIER,
 *         presentation-context-id INTEGER,
 *         context-negotiation SEQUENCE {
 *             presentation-context-id INTEGER,
 *             transfer-syntax OBJECT IDENTIFIER },
 *         transfer-syntax OBJECT IDENTIFIER,
 *         fixed NULL },
 *     string-value OCTET STRING }
 * ```
 *
 * This assumes `AUTOMATIC TAGS`, so all of the `identification`
 * choices will be `CONTEXT-SPECIFIC` and numbered from 0 to 5.
 */
export default
class CharacterString {
    constructor (
        readonly identification: ASN1Element,
        readonly stringValue: Uint8Array,
    ) {}

    public toString (): string {
        return this.toStringEx(100);
    }

    /**
     * ASN.1 value notation for this `CHARACTER STRING`, with a recursion budget
     * for the `identification` CHOICE.
     */
    public toStringEx (recursionTTL: number): string {
        if (recursionTTL <= 0) {
            return "[...]";
        }
        return (
            "CHARACTER STRING { identification "
            + stringifyIdentification(this.identification, recursionTTL - 1)
            + " , string-value "
            + formatOctetStringValue(this.stringValue)
            + " }"
        );
    }

    public toJSON (): unknown {
        return this.toJSONEx(100);
    }

    /**
     * JSON representation of this `CHARACTER STRING`, with a recursion budget
     * for the `identification` CHOICE.
     */
    public toJSONEx (recursionTTL: number): unknown {
        if (recursionTTL <= 0) {
            return undefined;
        }
        return {
            identification: identificationToJSON(this.identification, recursionTTL - 1),
            dataValue: Array.from(this.stringValue).map((byte) => byte.toString(16)).join(""),
        };
    }
}
