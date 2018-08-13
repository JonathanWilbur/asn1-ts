import { ASN1Element, ASN1TagClass, ASN1Construction } from "./asn1";
import { OID } from "./types/objectidentifier";
export declare class BERElement extends ASN1Element {
    boolean: boolean;
    integer: number;
    bitString: boolean[];
    octetString: Uint8Array;
    objectIdentifier: OID;
    objectDescriptor: string;
    real: number;
    enumerated: number;
    constructor(tagClass?: ASN1TagClass, construction?: ASN1Construction, tagNumber?: number);
    fromBytes(bytes: Uint8Array): number;
}
