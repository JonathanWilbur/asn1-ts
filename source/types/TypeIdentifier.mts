import type ASN1Element from "../asn1.mjs";
import ObjectIdentifier from "./ObjectIdentifier.mjs";

/**
 * From ITU X.681, Annex A.2:
 * ```asn1
 * TYPE-IDENTIFIER ::= CLASS {
 *     &id OBJECT IDENTIFIER UNIQUE,
 *     &Type }
 * WITH SYNTAX {
 *     &Type
 *     IDENTIFIED BY &id
 * }
 * ```
 */
export default
class TypeIdentifier<Element extends ASN1Element> {
    constructor (
        readonly id: ObjectIdentifier,
        readonly type: Element,
    ) {}
}
