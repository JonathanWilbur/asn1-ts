export declare class ASN1Error extends Error {
    constructor(m: string);
}
export declare class ASN1NotImplementedError extends ASN1Error {
    constructor();
}
export declare class ASN1RecursionError extends ASN1Error {
    constructor();
}
export declare class ASN1TruncationError extends ASN1Error {
    constructor(m: string);
}
export declare class ASN1OverflowError extends ASN1Error {
    constructor(m: string);
}
export declare class ASN1SizeError extends ASN1Error {
    constructor(m: string);
}
export declare class ASN1PaddingError extends ASN1Error {
    constructor(m: string);
}
export declare class ASN1UndefinedError extends ASN1Error {
    constructor(m: string);
}
export declare class ASN1CharactersError extends ASN1Error {
    constructor(m: string);
}
export declare class ASN1ConstructionError extends ASN1Error {
    constructor(m: string);
}
//# sourceMappingURL=errors.d.ts.map