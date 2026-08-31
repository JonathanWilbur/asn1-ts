import type ASN1Element from "../asn1.mjs";
import bytesToHex from "../utils/bytesToHex.mjs";
import { formatOctetStringValue, identificationToJSON, stringifyIdentification } from "../utils/asn1ValueNotation.mjs";
import {
    EMBEDDED_PDV_BRAND,
    isEmbeddedPDVLike,
    stampBrand,
} from "../brands.mjs";

/**
 * An `EmbeddedPDV` is a constructed data type, defined in
 * the [International Telecommunications Union](https://www.itu.int)'s
 * [X.680](https://www.itu.int/rec/T-REC-X.680/en).
 * 
 * The specification defines `EmbeddedPDV` as:
 * 
 * ```asn1
 * EmbeddedPDV ::= [UNIVERSAL 11] IMPLICIT SEQUENCE {
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
 *     data-value-descriptor ObjectDescriptor OPTIONAL,
 *     data-value OCTET STRING }
 * (WITH COMPONENTS { ... , data-value-descriptor ABSENT })
 * ```
 * 
 * This assumes `AUTOMATIC TAGS`, so all of the `identification`
 * choices will be `CONTEXT-SPECIFIC` and numbered from 0 to 5.
 * 
 * The following additional constraints are applied to the abstract syntax
 * when using Canonical Encoding Rules or Distinguished Encoding Rules,
 * which are also defined in the
 * [International Telecommunications Union](https://www.itu.int/en/pages/default.aspx)'s
 * [X.690 - ASN.1 encoding rules](http://www.itu.int/rec/T-REC-X.690/en):
 * 
 * ```asn1
 * EmbeddedPDV ( WITH COMPONENTS {
 *     ... ,
 *     identification ( WITH COMPONENTS {
 *         ... ,
 *         presentation-context-id ABSENT,
 *         context-negotiation ABSENT } ) } )
 * ```
 * 
 * The stated purpose of the constraints shown above is to restrict the use of
 * the `presentation-context-id`, either by itself or within the
 * context-negotiation, which makes the following the effective abstract
 * syntax of `EmbeddedPDV` when using Canonical Encoding Rules or
 * Distinguished Encoding Rules:
 * 
 * ```asn1
 * EmbeddedPDV ::= [UNIVERSAL 11] IMPLICIT SEQUENCE {
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
 *     data-value-descriptor ObjectDescriptor OPTIONAL,
 *     data-value OCTET STRING }
 *         ( WITH COMPONENTS {
 *             ... ,
 *             identification ( WITH COMPONENTS {
 *                 ... ,
 *                 presentation-context-id ABSENT,
 *                 context-negotiation ABSENT } ) } )
 * ```
 * 
 * With the constraints applied, the abstract syntax for `EmbeddedPDV`s encoded
 * using Canonical Encoding Rules or Distinguished Encoding Rules becomes:
 * 
 * ```asn1
 * EmbeddedPDV ::= [UNIVERSAL 11] IMPLICIT SEQUENCE {
 *     identification CHOICE {
 *         syntaxes SEQUENCE {
 *             abstract OBJECT IDENTIFIER,
 *             transfer OBJECT IDENTIFIER },
 *         syntax OBJECT IDENTIFIER,
 *         transfer-syntax OBJECT IDENTIFIER,
 *         fixed NULL },
 *     data-value-descriptor ObjectDescriptor OPTIONAL,
 *     data-value OCTET STRING }
 * ```
*/
export default
class EmbeddedPDV {
    /**
     * `true` if `value` is an `EMBEDDED PDV` from this copy or another copy of
     * the package, or a structural stand-in with `identification` and
     * `dataValue`.
     *
     * @param value The value to test
     */
    static isClassOf (value: unknown): value is EmbeddedPDV {
        return isEmbeddedPDVLike(value);
    }

    constructor (
        readonly identification: ASN1Element,
        readonly dataValue: Uint8Array,
    ) {}

    public toString (): string {
        return this.toStringEx(100);
    }

    /**
     * ASN.1 value notation for this `EMBEDDED PDV`, with a recursion budget
     * for the `identification` CHOICE.
     */
    public toStringEx (recursionTTL: number): string {
        if (recursionTTL <= 0) {
            return "[...]";
        }
        return (
            "EMBEDDED PDV { identification "
            + stringifyIdentification(this.identification, recursionTTL - 1)
            + " , data-value "
            + formatOctetStringValue(this.dataValue)
            + " }"
        );
    }

    public toJSON (): unknown {
        return this.toJSONEx(100);
    }

    /**
     * JSON representation of this `EMBEDDED PDV`, with a recursion budget for
     * the `identification` CHOICE.
     */
    public toJSONEx (recursionTTL: number): unknown {
        if (recursionTTL <= 0) {
            return undefined;
        }
        return {
            identification: identificationToJSON(this.identification, recursionTTL - 1),
            dataValue: bytesToHex(this.dataValue),
        };
    }
}

stampBrand(EmbeddedPDV.prototype, EMBEDDED_PDV_BRAND);
