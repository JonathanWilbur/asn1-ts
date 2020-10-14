import { ASN1Decoder, ASN1Encoder } from "../functional";
import type { OBJECT_IDENTIFIER } from "../macros";

export default
interface TYPE_IDENTIFIER<
    Type = any /* OBJECT_CLASS_TYPE_FIELD_PARAMETER */
> {
    decode: Partial<{ // For decoding types supplied in type fields
        [K in keyof TYPE_IDENTIFIER<Type>]: ASN1Decoder<TYPE_IDENTIFIER<Type>>;
    }>;
    encode: Partial<{ // For encoding types supplied in type fields
        [K in keyof TYPE_IDENTIFIER<Type>]: ASN1Encoder<TYPE_IDENTIFIER<Type>>;
    }>;
    "&id": OBJECT_IDENTIFIER, /* UNIQUE */
    "&Type": Type,
}
