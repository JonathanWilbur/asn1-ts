import ASN1Element from "./asn1";
import * as errors from "./errors";
import { ASN1Construction } from "./values";
import encodeInteger from "./codecs/x690/encoders/encodeInteger";
import decodeInteger from "./codecs/x690/decoders/decodeInteger";
import encodeObjectIdentifier from "./codecs/x690/encoders/encodeObjectIdentifier";
import decodeObjectIdentifier from "./codecs/x690/decoders/decodeObjectIdentifier";
import encodeRelativeObjectIdentifier from "./codecs/x690/encoders/encodeRelativeObjectIdentifier";
import decodeRelativeObjectIdentifier from "./codecs/x690/decoders/decodeRelativeObjectIdentifier";
import encodeTime from "./codecs/x690/encoders/encodeTime";
import decodeTime from "./codecs/x690/decoders/decodeTime";
import encodeDate from "./codecs/x690/encoders/encodeDate";
import decodeDate from "./codecs/x690/decoders/decodeDate";
import encodeTimeOfDay from "./codecs/x690/encoders/encodeTimeOfDay";
import decodeTimeOfDay from "./codecs/x690/decoders/decodeTimeOfDay";
import encodeDateTime from "./codecs/x690/encoders/encodeDateTime";
import decodeDateTime from "./codecs/x690/decoders/decodeDateTime";
import encodeOIDIRI from "./codecs/x690/encoders/encodeOIDIRI";
import decodeOIDIRI from "./codecs/x690/decoders/decodeOIDIRI";
import encodeRelativeOIDIRI from "./codecs/x690/encoders/encodeRelativeOIDIRI";
import decodeRelativeOIDIRI from "./codecs/x690/decoders/decodeRelativeOIDIRI";
import type {
    INTEGER,
    OBJECT_IDENTIFIER,
    ENUMERATED,
    RELATIVE_OID,
    TIME,
    DATE,
    TIME_OF_DAY,
    DATE_TIME,
    OID_IRI,
    RELATIVE_OID_IRI,
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

    set time (value: TIME) {
        this.value = encodeTime(value);
    }

    get time (): TIME {
        return decodeTime(this.value);
    }

    set date (value: DATE) {
        this.value = encodeDate(value);
    }

    get date (): DATE {
        return decodeDate(this.value);
    }

    set timeOfDay (value: TIME_OF_DAY) {
        this.value = encodeTimeOfDay(value);
    }

    get timeOfDay (): TIME_OF_DAY {
        return decodeTimeOfDay(this.value);
    }

    set dateTime (value: DATE_TIME) {
        this.value = encodeDateTime(value);
    }

    get dateTime (): DATE_TIME {
        return decodeDateTime(this.value);
    }

    set oidIRI (value: OID_IRI) {
        this.value = encodeOIDIRI(value);
    }

    get oidIRI (): OID_IRI {
        return decodeOIDIRI(this.value);
    }

    set relativeOIDIRI (value: RELATIVE_OID_IRI) {
        this.value = encodeRelativeOIDIRI(value);
    }

    get relativeOIDIRI (): RELATIVE_OID_IRI {
        return decodeRelativeOIDIRI(this.value);
    }
}
