import { ASN1Construction, ASN1TagClass, LengthEncodingPreference } from "../values";
import { X690Element } from "../x690";
export declare class BERElement extends X690Element {
    static lengthEncodingPreference: LengthEncodingPreference;
    boolean: boolean;
    bitString: boolean[];
    octetString: Uint8Array;
    objectDescriptor: string;
    real: number;
    utf8String: string;
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
    generalString: string;
    /** NOTE:
    * This might not decode anything above 0xFFFF, because JavaScript
    * natively uses either UCS-2 or UTF-16. If it uses UTF-16 (which
    * most do), it might work, but UCS-2 will definitely not work.
    */
    universalString: string;
    bmpString: string;
    constructor(tagClass?: ASN1TagClass, construction?: ASN1Construction, tagNumber?: number);
    fromBytes(bytes: Uint8Array): number;
    toBytes(): Uint8Array;
    private deconstruct;
}
