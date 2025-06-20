import type { ASN1Decoder, ASN1Encoder } from "../functional.mjs";
import type { OBJECT_IDENTIFIER } from "../macros.mjs";

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
interface TYPE_IDENTIFIER<
    Type = any /* OBJECT_CLASS_TYPE_FIELD_PARAMETER */
> {
    class: string; // This is often aliased, so it cannot be const "TYPE-IDENTIFIER".
    decoderFor: Partial<{ // For decoding types supplied in type fields
        [_K in keyof TYPE_IDENTIFIER<Type>]: ASN1Decoder<TYPE_IDENTIFIER<Type>[_K]>;
    }>;
    encoderFor: Partial<{ // For encoding types supplied in type fields
        [_K in keyof TYPE_IDENTIFIER<Type>]: ASN1Encoder<TYPE_IDENTIFIER<Type>[_K]>;
    }>;
    "&id": OBJECT_IDENTIFIER, /* UNIQUE */
    "&Type": Type,
}
