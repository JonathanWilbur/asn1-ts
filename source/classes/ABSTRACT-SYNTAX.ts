import { ASN1Decoder, ASN1Encoder } from "../functional";
import type { OBJECT_IDENTIFIER, BIT_STRING } from "../macros";


/**
 * From ITU X.681, Annex B.2:
 *
 * ```asn1
 * ABSTRACT-SYNTAX ::= CLASS
 * {
 *     &id OBJECT IDENTIFIER UNIQUE,
 *     &Type,
 *     &property BIT STRING {handles-invalid-encodings(0)} DEFAULT {}
 * }
 * WITH SYNTAX {
 *     &Type
 *     IDENTIFIED BY &id
 *     [HAS PROPERTY &property]
 * }
 * ```
 */
export default
interface ABSTRACT_SYNTAX <
    Type = any,
> {
    decode: Partial<{ // For decoding types supplied in type fields
        [K in keyof ABSTRACT_SYNTAX<Type>]: ASN1Decoder<ABSTRACT_SYNTAX<Type>>;
    }>;
    encode: Partial<{ // For encoding types supplied in type fields
        [K in keyof ABSTRACT_SYNTAX<Type>]: ASN1Encoder<ABSTRACT_SYNTAX<Type>>;
    }>;
    "&id": OBJECT_IDENTIFIER, /* UNIQUE */
    "&Type": Type,
    "&property": BIT_STRING,
}
