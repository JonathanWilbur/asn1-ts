import { ASN1Element } from "./asn1";
import { OID } from "./types/objectidentifier";
export declare class BERElement extends ASN1Element {
    boolean: boolean;
    integer: number;
    bitString: boolean[];
    octetString: Uint8Array;
    objectIdentifier: OID;
    objectDescriptor: string;
    real: number;
    constructor(data?: Uint8Array);
}
