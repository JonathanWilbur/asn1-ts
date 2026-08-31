import * as asn1 from "../../dist/index.mjs";
import * as asn1fn from "../../dist/functional.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

/**
 * A stand-in for an `ObjectIdentifier` produced by another copy of this
 * package: the real instance API (`toBytes`, `isEqualTo`) and no `fromParts`
 * (that method is static).
 */
function foreignOid (bytes) {
    return {
        toBytes () {
            return bytes;
        },
        isEqualTo () {
            return false;
        },
    };
}

/**
 * A stand-in for an `ASN1Element` produced by an older copy that does not
 * stamp a `Symbol.for` brand.
 */
function foreignElement ({ tagClass, tagNumber, construction, bytes }) {
    return {
        tagClass,
        tagNumber,
        construction,
        toBytes () {
            return bytes;
        },
        encodeInto (destination, offset) {
            destination.set(bytes, offset);
            return offset + bytes.length;
        },
        tlvLength () {
            return bytes.length;
        },
    };
}

describe("Symbol.hasInstance across package copies", () => {
    it("treats same-copy elements and OIDs as instances of their classes", () => {
        const der = new asn1.DERElement();
        const ber = new asn1.BERElement();
        const cer = new asn1.CERElement();
        const oid = asn1.ObjectIdentifier.fromParts([ 2, 5, 4, 3 ]);
        assert(der instanceof asn1.ASN1Element);
        assert(ber instanceof asn1.ASN1Element);
        assert(cer instanceof asn1.ASN1Element);
        assert(der instanceof asn1.DERElement);
        assert(ber instanceof asn1.BERElement);
        assert(cer instanceof asn1.CERElement);
        assert(oid instanceof asn1.ObjectIdentifier);
    });

    it("does not report a BER or CER element as a DERElement", () => {
        const ber = new asn1.BERElement();
        const cer = new asn1.CERElement();
        const der = new asn1.DERElement();
        assert(!(ber instanceof asn1.DERElement));
        assert(!(cer instanceof asn1.DERElement));
        assert(!(der instanceof asn1.BERElement));
        assert(!(der instanceof asn1.CERElement));
        assert(!(ber instanceof asn1.CERElement));
        assert(!(cer instanceof asn1.BERElement));
    });

    it("recognizes a foreign OID that only has toBytes and isEqualTo", () => {
        const oid = foreignOid(new Uint8Array([ 0x55, 0x04, 0x03 ]));
        assert(oid instanceof asn1.ObjectIdentifier);
        assert(asn1.isObjectIdentifierLike(oid));
        assert(!(oid instanceof asn1.ASN1Element));
    });

    it("does not treat the legacy { fromParts, toBytes } bag as an OID instance", () => {
        const oid = {
            fromParts () {},
            toBytes () {
                return new Uint8Array([ 0x55, 0x04, 0x03 ]);
            },
        };
        assert(!(oid instanceof asn1.ObjectIdentifier));
        assert(!asn1.isObjectIdentifierLike(oid));
    });

    it("recognizes a foreign element by tag fields and toBytes", () => {
        const el = foreignElement({
            tagClass: asn1.ASN1TagClass.universal,
            tagNumber: asn1.ASN1UniversalType.integer,
            construction: asn1.ASN1Construction.primitive,
            bytes: new Uint8Array([ 0x02, 0x01, 0x05 ]),
        });
        assert(el instanceof asn1.ASN1Element);
        assert(asn1.isASN1ElementLike(el));
        assert(!(el instanceof asn1.DERElement));
        assert(!(el instanceof asn1.ObjectIdentifier));
    });

    it("recognizes another copy's branded objects via Symbol.for", () => {
        const brandedOid = {
            [asn1.OBJECT_IDENTIFIER_BRAND]: true,
            toBytes () {
                return new Uint8Array([ 0x55, 0x04, 0x03 ]);
            },
        };
        const brandedEl = {
            [asn1.ASN1_ELEMENT_BRAND]: true,
            tagClass: 0,
            tagNumber: 2,
            construction: 0,
            toBytes () {
                return new Uint8Array([ 0x02, 0x01, 0x05 ]);
            },
        };
        const brandedDer = {
            [asn1.ASN1_ELEMENT_BRAND]: true,
            [asn1.DER_ELEMENT_BRAND]: true,
        };
        assert(brandedOid instanceof asn1.ObjectIdentifier);
        assert(brandedEl instanceof asn1.ASN1Element);
        assert(brandedDer instanceof asn1.DERElement);
        assert(brandedDer instanceof asn1.ASN1Element);
        assert(!(brandedEl instanceof asn1.DERElement));
    });

    it("does not match unrelated objects", () => {
        assert(!({} instanceof asn1.ASN1Element));
        assert(!({} instanceof asn1.ObjectIdentifier));
        assert(!(new Date() instanceof asn1.ASN1Element));
        assert(!(new Uint8Array(0) instanceof asn1.ASN1Element));
        assert(!asn1.isASN1ElementLike(null));
        assert(!asn1.isObjectIdentifierLike(undefined));
    });
});

describe("encode() with values from another copy", () => {
    [
        asn1.BERElement,
        asn1.CERElement,
        asn1.DERElement,
    ].forEach((CodecElement) => {
        describe(CodecElement.name, () => {
            it("encodes a foreign OID that has no instance fromParts", () => {
                const el = new CodecElement();
                el.encode(foreignOid(new Uint8Array([ 0x55, 0x04, 0x03 ])));
                assert.equal(el.tagNumber, asn1.ASN1UniversalType.objectIdentifier);
                assert.deepEqual(el.value, new Uint8Array([ 0x55, 0x04, 0x03 ]));
            });

            it("wraps a foreign element as a SEQUENCE instead of throwing", () => {
                const inner = foreignElement({
                    tagClass: asn1.ASN1TagClass.universal,
                    tagNumber: asn1.ASN1UniversalType.integer,
                    construction: asn1.ASN1Construction.primitive,
                    bytes: new Uint8Array([ 0x02, 0x01, 0x05 ]),
                });
                const el = new CodecElement();
                el.encode(inner);
                assert.equal(el.construction, asn1.ASN1Construction.constructed);
                assert.equal(el.sequence.length, 1);
                assert.equal(el.sequence[0], inner);
            });

            it("does not encode a foreign element as an object identifier", () => {
                const inner = foreignElement({
                    tagClass: asn1.ASN1TagClass.universal,
                    tagNumber: asn1.ASN1UniversalType.integer,
                    construction: asn1.ASN1Construction.primitive,
                    bytes: new Uint8Array([ 0x02, 0x01, 0x05 ]),
                });
                inner.isEqualTo = () => false;
                const el = new CodecElement();
                el.encode(inner);
                assert.notEqual(el.tagNumber, asn1.ASN1UniversalType.objectIdentifier);
                assert.equal(el.sequence[0], inner);
            });
        });
    });
});

describe("encodeExternal with a foreign element", () => {
    it("uses the single-ASN1-type alternative instead of BIT STRING", () => {
        const inner = foreignElement({
            tagClass: asn1.ASN1TagClass.universal,
            tagNumber: asn1.ASN1UniversalType.integer,
            construction: asn1.ASN1Construction.primitive,
            bytes: new Uint8Array([ 0x02, 0x01, 0x05 ]),
        });
        const ext = new asn1.External(undefined, undefined, undefined, inner);
        const el = new asn1.DERElement();
        el.external = ext;
        const decoded = el.external;
        assert.equal(decoded.encoding.tagClass, asn1.ASN1TagClass.universal);
        assert.equal(decoded.encoding.tagNumber, asn1.ASN1UniversalType.integer);
        assert.equal(decoded.encoding.integer, 5);
    });
});

describe("_encode_choice with a foreign element", () => {
    it("returns an already-encoded foreign element instead of reading Object.keys", () => {
        const inner = new asn1.DERElement();
        inner.integer = 5;
        const encode = asn1fn._encode_choice(
            { a: asn1fn._encodeInteger },
            () => new asn1.DERElement(),
        );
        assert.equal(encode(inner), inner);

        const foreign = foreignElement({
            tagClass: inner.tagClass,
            tagNumber: inner.tagNumber,
            construction: inner.construction,
            bytes: inner.toBytes(),
        });
        assert.equal(encode(foreign), foreign);
    });
});

describe("functional sequence/set decode with a foreign element", () => {
    it("calls sequenceElements when present so zero-copy still works", () => {
        const children = [ new asn1.DERElement(), new asn1.DERElement() ];
        children[0].integer = 1;
        children[1].integer = 2;
        let seenZeroCopy;
        const host = {
            sequenceElements (zeroCopy) {
                seenZeroCopy = zeroCopy;
                return children;
            },
            get sequence () {
                return [];
            },
        };
        assert.deepEqual(asn1fn._decodeSequence(host), children);
        assert.equal(seenZeroCopy, true);
        assert.deepEqual(asn1fn._decodeSequenceCloned(host), children);
        assert.equal(seenZeroCopy, false);
    });

    it("calls setElements when present", () => {
        const children = [ new asn1.DERElement() ];
        children[0].integer = 1;
        let seenZeroCopy;
        const host = {
            setElements (zeroCopy) {
                seenZeroCopy = zeroCopy;
                return children;
            },
            get set () {
                return [];
            },
        };
        assert.deepEqual(asn1fn._decodeSet(host), children);
        assert.equal(seenZeroCopy, true);
    });
});
