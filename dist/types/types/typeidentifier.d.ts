import { ASN1Element } from "../asn1";
import { ObjectIdentifier } from "./objectidentifier";
export default class TypeIdentifier<Element extends ASN1Element> {
    readonly id: ObjectIdentifier;
    readonly type: Element;
    constructor(id: ObjectIdentifier, type: Element);
}
