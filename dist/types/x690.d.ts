import { ASN1Element } from "./asn1";
import { ObjectIdentifier as OID } from "./types/objectidentifier";
import { ASN1Construction, ASN1TagClass } from "./values";
export declare abstract class X690Element extends ASN1Element {
    validateTag(permittedClasses: ASN1TagClass[], permittedConstruction: ASN1Construction[], permittedNumbers: number[]): 0 | -1 | -2 | -3;
    /**
     * This only accepts integers between MIN_SINT_32 and MAX_SINT_32 because
     * JavaScript's bitshift operators treat all integers as though they were
     * 32-bit integers, even though they are stored in the 53 mantissa bits of
     * an IEEE double-precision floating point number. Accepting larger or
     * smaller numbers would rule out the use of a critical arithmetic operator
     * when lower-level binary operations are not available, as is the case in
     * JavaScript.
     */
    integer: number;
    objectIdentifier: OID;
    enumerated: number;
    relativeObjectIdentifier: number[];
    protected static decodeObjectIdentifierNodes(value: Uint8Array): number[];
    protected static encodeObjectIdentifierNodes(value: number[]): number[];
    static isInCanonicalOrder(elements: X690Element[]): boolean;
    static isUniquelyTagged(elements: X690Element[]): boolean;
}
