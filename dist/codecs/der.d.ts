import { ASN1Construction, ASN1TagClass } from "../values";
import { X690Element } from "../x690";
export declare class DERElement extends X690Element {
    boolean: boolean;
    bitString: boolean[];
    octetString: Uint8Array;
    objectDescriptor: string;
    real: number;
    utf8String: string;
    sequence: DERElement[];
    set: DERElement[];
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
    universalString: string;
    bmpString: string;
    encode(value: any): void;
    constructor(tagClass?: ASN1TagClass, construction?: ASN1Construction, tagNumber?: number, value?: any);
    fromBytes(bytes: Uint8Array): number;
    toBytes(): Uint8Array;
}
//# sourceMappingURL=der.d.ts.map