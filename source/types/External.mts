import type {
    BIT_STRING,
    INTEGER,
    OBJECT_IDENTIFIER,
    OCTET_STRING,
    ObjectDescriptor,
} from "../macros.mjs";
import type ASN1Element from "../asn1.mjs";
import packBits from "../utils/packBits.mjs";
import bytesToHex from "../utils/bytesToHex.mjs";
import { formatBitStringValue, formatOctetStringValue } from "../utils/asn1ValueNotation.mjs";
import {
    EXTERNAL_BRAND,
    isExternalLike,
    stampBrand,
} from "../brands.mjs";

/**
 * How `EXTERNAL` is to be encoded, per X.690:
 *
 * ```asn1
 * EXTERNAL ::= [UNIVERSAL 8] IMPLICIT SEQUENCE {
 *     direct-reference OBJECT IDENTIFIER OPTIONAL,
 *     indirect-reference INTEGER OPTIONAL,
 *     data-value-descriptor ObjectDescriptor OPTIONAL,
 *     encoding CHOICE {
 *         single-ASN1-type [0] ABSTRACT-SYNTAX.&Type,
 *         octet-aligned [1] IMPLICIT OCTET STRING,
 *         arbitrary [2] IMPLICIT BIT STRING } }
 * ```
 */
export default
class External {
    /**
     * `true` if `value` is an `EXTERNAL` from this copy or another copy of
     * the package, or a structural stand-in with `encoding` and
     * `directReference`.
     *
     * @param value The value to test
     */
    static isClassOf (value: unknown): value is External {
        return isExternalLike(value);
    }

    constructor (
        readonly directReference: OBJECT_IDENTIFIER | undefined,
        readonly indirectReference: INTEGER | undefined,
        readonly dataValueDescriptor: ObjectDescriptor | undefined,
        readonly encoding: ASN1Element | OCTET_STRING | BIT_STRING,
    ) {}

    public toString (): string {
        return this.toStringEx(100);
    }

    /**
     * ASN.1 value notation for this `EXTERNAL`, with a recursion budget for
     * the `single-ASN1-type` alternative.
     */
    public toStringEx (recursionTTL: number): string {
        if (recursionTTL <= 0) {
            return "[...]";
        }
        const parts: string[] = [];
        if (this.directReference) {
            parts.push(`direct-reference ${this.directReference.asn1Notation}`);
        }
        if (this.indirectReference !== undefined) {
            parts.push(`indirect-reference ${this.indirectReference.toString()}`);
        }
        if (this.dataValueDescriptor) {
            parts.push(`data-value-descriptor "${this.dataValueDescriptor}"`);
        }
        if (this.encoding instanceof Uint8Array) {
            parts.push(`encoding octet-aligned : ${formatOctetStringValue(this.encoding)}`);
        } else if (this.encoding instanceof Uint8ClampedArray) {
            parts.push(`encoding arbitrary : ${formatBitStringValue(this.encoding)}`);
        } else {
            parts.push(`encoding single-ASN1-type : ${this.encoding.toStringEx(recursionTTL - 1)}`);
        }
        return `EXTERNAL { ${parts.join(" , ")} }`;
    }

    public toJSON (): unknown {
        return this.toJSONEx(100);
    }

    /**
     * JSON representation of this `EXTERNAL`, with a recursion budget for
     * the `single-ASN1-type` alternative.
     */
    public toJSONEx (recursionTTL: number): unknown {
        if (recursionTTL <= 0) {
            return undefined;
        }
        return {
            directReference: this.directReference,
            indirectReference: this.indirectReference,
            dataValueDescriptor: this.dataValueDescriptor,
            encoding: ((): unknown => {
                if (this.encoding instanceof Uint8Array) {
                    return bytesToHex(this.encoding);
                } else if (this.encoding instanceof Uint8ClampedArray) {
                    const bits = this.encoding;
                    return {
                        length: bits.length,
                        value: bytesToHex(packBits(bits)),
                    };
                } else {
                    return this.encoding.toJSONEx(recursionTTL - 1);
                }
            })(),
        };
    }
}

stampBrand(External.prototype, EXTERNAL_BRAND);
