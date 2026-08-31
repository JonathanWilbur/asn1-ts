import type ASN1Element from "../asn1.mjs";
import bytesToHex from "../utils/bytesToHex.mjs";
import { formatOctetStringValue, identificationToJSON, stringifyIdentification } from "../utils/asn1ValueNotation.mjs";
import {
    CHARACTER_STRING_BRAND,
    isCharacterStringLike,
    stampBrand,
} from "../brands.mjs";

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
    /**
     * `true` if `value` is a `CHARACTER STRING` from this copy or another copy
     * of the package, or a structural stand-in with `identification` and
     * `stringValue`.
     *
     * @param value The value to test
     */
    static isCharacterString (value: unknown): value is CharacterString {
        return isCharacterStringLike(value);
    }

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
            dataValue: bytesToHex(this.stringValue),
        };
    }
}

stampBrand(CharacterString.prototype, CHARACTER_STRING_BRAND);
