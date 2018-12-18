import { ASN1Element } from "../asn1";
import { ObjectIdentifier } from "./objectidentifier";

// From ITU X.681, Annex A.2:

// TYPE-IDENTIFIER ::= CLASS {
//     &id OBJECT IDENTIFIER UNIQUE,
//     &Type }
//     WITH SYNTAX {&Type IDENTIFIED BY &id}

export
class TypeIdentifier<Element extends ASN1Element> {

    constructor (
        readonly id : ObjectIdentifier,
        readonly type : Element
    ) {}

}