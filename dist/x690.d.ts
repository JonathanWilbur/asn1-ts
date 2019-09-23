import { ASN1Element } from "./asn1";
import { ObjectIdentifier as OID } from "./types/objectidentifier";
import { ASN1Construction, ASN1TagClass } from "./values";
export declare abstract class X690Element extends ASN1Element {
    validateTag(permittedClasses: ASN1TagClass[], permittedConstruction: ASN1Construction[], permittedNumbers: number[]): number;
    integer: number;
    objectIdentifier: OID;
    enumerated: number;
    relativeObjectIdentifier: number[];
    protected static decodeObjectIdentifierNodes(value: Uint8Array): number[];
    protected static encodeObjectIdentifierNodes(value: number[]): number[];
    static isInCanonicalOrder(elements: X690Element[]): boolean;
    static isUniquelyTagged(elements: X690Element[]): boolean;
}
//# sourceMappingURL=x690.d.ts.map