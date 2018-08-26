import { ASN1Element } from "./asn1";
import { ObjectIdentifier as OID } from "./types/objectidentifier";
export declare abstract class X690Element extends ASN1Element {
    integer: number;
    objectIdentifier: OID;
    enumerated: number;
    relativeObjectIdentifier: number[];
    protected static decodeObjectIdentifierNodes(value: Uint8Array): number[];
    protected static encodeObjectIdentifierNodes(value: number[]): number[];
}
