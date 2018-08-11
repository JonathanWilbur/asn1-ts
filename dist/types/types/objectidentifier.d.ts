export declare type ROID = RelativeObjectIdentifier;
export declare type RelativeObjectIdentifier = number[];
export declare type OID = ObjectIdentifier;
export declare class ObjectIdentifier {
    readonly _nodes: number[];
    constructor(nodes: number[]);
    readonly nodes: number[];
    readonly dotDelimitedNotation: string;
    toString(): string;
}
