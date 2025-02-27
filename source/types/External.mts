import { BIT_STRING, INTEGER, OBJECT_IDENTIFIER, OCTET_STRING, ObjectDescriptor } from "../macros.mjs";
import type ASN1Element from "../asn1.mjs";
import packBits from "../utils/packBits.mjs";

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
        readonly directReference: OBJECT_IDENTIFIER | undefined,
        readonly indirectReference: INTEGER | undefined,
        readonly dataValueDescriptor: ObjectDescriptor | undefined,
        readonly encoding: ASN1Element | OCTET_STRING | BIT_STRING,
    ) {}

    public toString (): string {
        let ret: string = "EXTERNAL { ";
        if (this.directReference) {
            ret += `directReference ${this.directReference.toString()} `;
        }
        if (this.indirectReference) {
            ret += `indirectReference ${this.indirectReference.toString()} `;
        }
        if (this.dataValueDescriptor) {
            ret += `dataValueDescriptor "${this.dataValueDescriptor}"`;
        }
        if (this.encoding instanceof Uint8Array) {
            ret += `octet-aligned ${Array.from(this.encoding).map((byte) => byte.toString(16)).join("")} `;
        } else if (this.encoding instanceof Uint8ClampedArray) {
            ret += `arbitrary ${this.encoding.toString()} `;
        } else {
            ret += `single-ASN1-type ${this.encoding.toString()} `;
        }
        ret += "}";
        return ret;
    }

    public toJSON (): unknown {
        return {
            directReference: this.directReference,
            indirectReference: this.indirectReference,
            dataValueDescriptor: this.dataValueDescriptor,
            encoding: ((): unknown => {
                if (this.encoding instanceof Uint8Array) {
                    return Array.from(this.encoding).map((byte) => byte.toString(16)).join("");
                } else if (this.encoding instanceof Uint8ClampedArray) {
                    const bits = this.encoding;
                    return {
                        length: bits.length,
                        value: Array.from(packBits(bits)).map((byte) => byte.toString(16)).join(""),
                    };
                } else {
                    return this.encoding.toJSON();
                }
            })(),
        }
    }
}
