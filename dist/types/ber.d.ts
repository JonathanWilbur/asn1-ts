import { ASN1Element, ASN1TagClass, ASN1Construction, LengthEncodingPreference } from "./asn1";
import { OID } from "./types/objectidentifier";
export declare class BERElement extends ASN1Element {
    static lengthEncodingPreference: LengthEncodingPreference;
    boolean: boolean;
    integer: number;
    bitString: boolean[];
    octetString: Uint8Array;
    objectIdentifier: OID;
    objectDescriptor: string;
    real: number;
    enumerated: number;
    utf8String: string;
    relativeObjectIdentifier: number[];
    sequence: BERElement[];
    set: BERElement[];
    numericString: string;
    printableString: string;
    teletexString: Uint8Array;
    videotexString: Uint8Array;
    ia5String: string;
    utcTime: Date;
    generalizedTime: Date;
    graphicString: string;
    visibleString: string;
    constructor(tagClass?: ASN1TagClass, construction?: ASN1Construction, tagNumber?: number);
    fromBytes(bytes: Uint8Array): number;
    toBytes(): Uint8Array;
}
