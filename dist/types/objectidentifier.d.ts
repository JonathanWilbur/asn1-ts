export declare class ObjectIdentifier {
    readonly _nodes: number[];
    constructor(nodes: number[]);
    readonly nodes: number[];
    readonly dotDelimitedNotation: string;
    toString(): string;
}
