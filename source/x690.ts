import ASN1Element from "./asn1";
import * as errors from "./errors";
import { ASN1Construction } from "./values";
import encodeInteger from "./codecs/x690/encoders/encodeInteger";
import decodeInteger from "./codecs/x690/decoders/decodeInteger";
import encodeObjectIdentifier from "./codecs/x690/encoders/encodeObjectIdentifier";
import decodeObjectIdentifier from "./codecs/x690/decoders/decodeObjectIdentifier";
import encodeRelativeObjectIdentifier from "./codecs/x690/encoders/encodeRelativeObjectIdentifier";
import decodeRelativeObjectIdentifier from "./codecs/x690/decoders/decodeRelativeObjectIdentifier";
import {
    INTEGER,
    OBJECT_IDENTIFIER,
    ENUMERATED,
    RELATIVE_OID,
} from "./macros";

export default
abstract class X690Element extends ASN1Element {
    /**
     * This only accepts integers between MIN_SINT_32 and MAX_SINT_32 because
     * JavaScript's bitshift operators treat all integers as though they were
     * 32-bit integers, even though they are stored in the 53 mantissa bits of
     * an IEEE double-precision floating point number. Accepting larger or
     * smaller numbers would rule out the use of a critical arithmetic operator
     * when lower-level binary operations are not available, as is the case in
     * JavaScript.
     */
    set integer (value: INTEGER) {
        this.value = encodeInteger(value);
    }

    get integer (): INTEGER {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("INTEGER cannot be constructed.", this);
        }
        return decodeInteger(this.value);
    }

    set objectIdentifier (value: OBJECT_IDENTIFIER) {
        this.value = encodeObjectIdentifier(value);
    }

    get objectIdentifier (): OBJECT_IDENTIFIER {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("OBJECT IDENTIFIER cannot be constructed.", this);
        }
        if (this.value.length === 0) {
            throw new errors.ASN1TruncationError("Encoded value was too short to be an OBJECT IDENTIFIER!", this);
        }
        return decodeObjectIdentifier(this.value);
    }

    set enumerated (value: ENUMERATED) {
        this.integer = value;
    }

    get enumerated (): ENUMERATED {
        return this.integer;
    }

    set relativeObjectIdentifier (value: RELATIVE_OID) {
        this.value = encodeRelativeObjectIdentifier(value);
    }

    get relativeObjectIdentifier (): RELATIVE_OID {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("Relative OID cannot be constructed.", this);
        }
        return decodeRelativeObjectIdentifier(this.value);
    }
}
