import { ASN1Element } from "./asn1";
import * as errors from "./errors";
import { ObjectIdentifier as OID } from "./types/objectidentifier";
import { ASN1Construction, ASN1TagClass, CANONICAL_TAG_CLASS_ORDERING } from "./values";
import encodeInteger from "./codecs/x690/encoders/encodeInteger";
import decodeInteger from "./codecs/x690/decoders/decodeInteger";
import encodeObjectIdentifier from "./codecs/x690/encoders/encodeObjectIdentifier";
import decodeObjectIdentifier from "./codecs/x690/decoders/decodeObjectIdentifier";
import encodeRelativeObjectIdentifier from "./codecs/x690/encoders/encodeRelativeObjectIdentifier";
import decodeRelativeObjectIdentifier from "./codecs/x690/decoders/decodeRelativeObjectIdentifier";

export
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
    set integer (value: number) {
        this.value = encodeInteger(value);
    }

    get integer (): number {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("INTEGER cannot be constructed.");
        }
        return decodeInteger(this.value);
    }

    set objectIdentifier (value: OID) {
        this.value = encodeObjectIdentifier(value);
    }

    get objectIdentifier (): OID {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("OBJECT IDENTIFIER cannot be constructed.");
        }
        if (this.value.length === 0) {
            throw new errors.ASN1TruncationError("Encoded value was too short to be an OBJECT IDENTIFIER!");
        }
        return decodeObjectIdentifier(this.value);
    }

    set enumerated (value: number) {
        this.integer = value;
    }

    get enumerated (): number {
        return this.integer;
    }

    set relativeObjectIdentifier (value: number[]) {
        this.value = encodeRelativeObjectIdentifier(value);
    }

    get relativeObjectIdentifier (): number[] {
        if (this.construction !== ASN1Construction.primitive) {
            throw new errors.ASN1ConstructionError("Relative OID cannot be constructed.");
        }
        return decodeRelativeObjectIdentifier(this.value);
    }

    // TODO: Remove in a major version change.
    public static isInCanonicalOrder (elements: X690Element[]): boolean {
        let previousTagClass: ASN1TagClass | null = null;
        let previousTagNumber: number | null = null;

        if (!elements.every((element): boolean => {
            // Checks that the tag classes are in canonical order
            if (
                previousTagClass !== null
                && element.tagClass !== previousTagClass
                && CANONICAL_TAG_CLASS_ORDERING.indexOf(element.tagClass)
                <= CANONICAL_TAG_CLASS_ORDERING.indexOf(previousTagClass)
            ) return false;

            // Checks that the tag numbers are in canonical order
            if (element.tagClass !== previousTagClass) previousTagNumber = null;
            if (previousTagNumber !== null && element.tagNumber < previousTagNumber) return false;

            previousTagClass = element.tagClass;
            previousTagNumber = element.tagNumber;
            return true;
        })) return false;

        return true;
    }

    // TODO: Remove in a major version change.
    public static isUniquelyTagged (elements: X690Element[]): boolean {
        const finds: { [ key: string ]: null } = {};
        for (let i = 0; i < elements.length; i++) {
            const key: string = `${elements[i].tagClass}.${elements[i].tagNumber}`;
            if (key in finds) return false;
            finds[key] = null;
        }
        return true;
    }
}
