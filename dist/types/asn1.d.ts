export declare enum ASN1TagClass {
    universal = 0,
    application = 1,
    context = 3,
    private = 4
}
export declare enum ASN1Construction {
    primitive = 0,
    constructed = 1
}
export declare class ASN1Error extends Error {
    constructor(m: string);
}
export declare class ASN1NotImplementedError extends ASN1Error {
    constructor();
}
export declare enum ASN1SpecialRealValue {
    plusInfinity = 64,
    minusInfinity = 65,
    notANumber = 66,
    minusZero = 67
}
export declare abstract class ASN1Element {
    protected static valueRecursionCount: number;
    protected static readonly nestingRecursionLimit: number;
    tagClass: ASN1TagClass;
    construction: ASN1Construction;
    tagNumber: number;
    value: Uint8Array;
    length(): number;
    constructor();
}
