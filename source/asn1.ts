import { ObjectIdentifier as OID } from "./types/objectidentifier";
import { ASN1TagClass,ASN1Construction } from "./values";

export
abstract class ASN1Element
{
    protected static lengthRecursionCount : number = 0;
    protected static valueRecursionCount : number = 0;
    protected static readonly nestingRecursionLimit : number = 5;

    public tagClass : ASN1TagClass = ASN1TagClass.universal;
    public construction : ASN1Construction = ASN1Construction.primitive;
    public tagNumber : number = 0;
    public value : Uint8Array = new Uint8Array(0);

    public length () : number {
        return this.value.length;
    }

    abstract set boolean (value : boolean);
    abstract get boolean () : boolean;
    abstract set integer (value : number);
    abstract get integer () : number;
    abstract set bitString (value : boolean[]);
    abstract get bitString () : boolean[];
    abstract set octetString (value : Uint8Array);
    abstract get octetString () : Uint8Array;
    abstract set objectIdentifier (value : OID);
    abstract get objectIdentifier () : OID;
    abstract set objectDescriptor (value : string);
    abstract get objectDescriptor () : string;
    // EXTERNAL
    abstract set real (value : number);
    abstract get real () : number;
    abstract set enumerated (value : number);
    abstract get enumerated () : number;
    // EmbeddedPDV
    abstract set utf8String (value : string);
    abstract get utf8String () : string;
    abstract set relativeObjectIdentifier (value : number[]);
    abstract get relativeObjectIdentifier () : number[];
    abstract set sequence (value : ASN1Element[]);
    abstract get sequence () : ASN1Element[];
    abstract set set (value : ASN1Element[]);
    abstract get set () : ASN1Element[];
    abstract set numericString (value : string);
    abstract get numericString () : string;
    abstract set printableString (value : string);
    abstract get printableString () : string;
    abstract set teletexString (value : Uint8Array);
    abstract get teletexString () : Uint8Array;
    abstract set videotexString (value : Uint8Array);
    abstract get videotexString () : Uint8Array;
    abstract set ia5String (value : string);
    abstract get ia5String () : string;
    abstract set utcTime (value : Date);
    abstract get utcTime () : Date;
    abstract set generalizedTime (value : Date);
    abstract get generalizedTime () : Date;
    abstract set graphicString (value : string);
    abstract get graphicString () : string;
    abstract set visibleString (value : string);
    abstract get visibleString () : string;
    abstract set generalString (value : string);
    abstract get generalString () : string;
    abstract set universalString (value : string);
    abstract get universalString () : string;
    // characterString
    abstract set bmpString (value : string);
    abstract get bmpString () : string;

    constructor() {

    }
}