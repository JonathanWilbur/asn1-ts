import ASN1Element from "./asn1.mjs";
import * as errors from "./errors.mjs";
import { ASN1Construction } from "./values.mjs";
import encodeInteger from "./codecs/x690/encoders/encodeInteger.mjs";
import decodeInteger from "./codecs/x690/decoders/decodeInteger.mjs";
import encodeObjectIdentifier from "./codecs/x690/encoders/encodeObjectIdentifier.mjs";
import decodeObjectIdentifier from "./codecs/x690/decoders/decodeObjectIdentifier.mjs";
import encodeRelativeObjectIdentifier from "./codecs/x690/encoders/encodeRelativeObjectIdentifier.mjs";
import decodeRelativeObjectIdentifier from "./codecs/x690/decoders/decodeRelativeObjectIdentifier.mjs";
import encodeTime from "./codecs/x690/encoders/encodeTime.mjs";
import decodeTime from "./codecs/x690/decoders/decodeTime.mjs";
import encodeDate from "./codecs/x690/encoders/encodeDate.mjs";
import decodeDate from "./codecs/x690/decoders/decodeDate.mjs";
import encodeTimeOfDay from "./codecs/x690/encoders/encodeTimeOfDay.mjs";
import decodeTimeOfDay from "./codecs/x690/decoders/decodeTimeOfDay.mjs";
import encodeDateTime from "./codecs/x690/encoders/encodeDateTime.mjs";
import decodeDateTime from "./codecs/x690/decoders/decodeDateTime.mjs";
import encodeOIDIRI from "./codecs/x690/encoders/encodeOIDIRI.mjs";
import decodeOIDIRI from "./codecs/x690/decoders/decodeOIDIRI.mjs";
import encodeRelativeOIDIRI from "./codecs/x690/encoders/encodeRelativeOIDIRI.mjs";
import decodeRelativeOIDIRI from "./codecs/x690/decoders/decodeRelativeOIDIRI.mjs";
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
} from "./macros.mjs";

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
        return decodeObjectIdentifier(this.value);
    }

    set enumerated (value: ENUMERATED) {
        this.integer = value;
    }

    get enumerated (): ENUMERATED {
        return Number(this.integer);
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
