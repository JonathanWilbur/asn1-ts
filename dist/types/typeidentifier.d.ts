import { ASN1Element } from "../asn1";
import { ObjectIdentifier } from "./objectidentifier";
export declare class TypeIdentifier<Element extends ASN1Element> {
    readonly id: ObjectIdentifier;
    readonly type: Element;
    constructor(id: ObjectIdentifier, type: Element);
}
//# sourceMappingURL=typeidentifier.d.ts.map