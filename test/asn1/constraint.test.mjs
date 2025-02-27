import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

[
    asn1.BERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(`${CodecElement.constructor.name} size-constraint validator`, () => {
        it("validates a BIT STRING", () => {
            const el = new CodecElement();
            el.bitString = [ true, false, true, false, true ];
            assert.doesNotThrow(() => {
                el.sizeConstrainedBitString(1, 5);
            });
            assert.throws(() => {
                el.sizeConstrainedBitString(0, 4);
            });
            assert.throws(() => {
                el.sizeConstrainedBitString(6, 8);
            });
        });

        it("validates an OCTET STRING", () => {
            const el = new CodecElement();
            el.octetString = new Uint8Array([ 1, 2, 3, 4, 5 ]);
            assert.doesNotThrow(() => {
                el.sizeConstrainedOctetString(1, 5);
            });
            assert.throws(() => {
                el.sizeConstrainedOctetString(0, 4);
            });
            assert.throws(() => {
                el.sizeConstrainedOctetString(6, 8);
            });
        });

        // I am not going to test all of the string types.
        it("validates an ObjectDescriptor", () => {
            const el = new CodecElement();
            el.objectDescriptor = "bloop";
            assert.doesNotThrow(() => {
                el.sizeConstrainedObjectDescriptor(1, 5);
            });
            assert.throws(() => {
                el.sizeConstrainedObjectDescriptor(0, 4);
            });
            assert.throws(() => {
                el.sizeConstrainedObjectDescriptor(6, 8);
            });
        });

        it("validates a SEQUENCE OF", () => {
            const el = new CodecElement();
            el.sequence = [
                new CodecElement(),
                new CodecElement(),
                new CodecElement(),
                new CodecElement(),
                new CodecElement(),
            ];
            assert.doesNotThrow(() => {
                el.sizeConstrainedSequenceOf(1, 5);
            });
            assert.throws(() => {
                el.sizeConstrainedSequenceOf(0, 4);
            });
            assert.throws(() => {
                el.sizeConstrainedSequenceOf(6, 8);
            });
        });

        it("validates a SET OF", () => {
            const el = new CodecElement();
            el.setOf = [
                new CodecElement(),
                new CodecElement(),
                new CodecElement(),
                new CodecElement(),
                new CodecElement(),
            ];
            assert.doesNotThrow(() => {
                el.sizeConstrainedSetOf(1, 5);
            });
            assert.throws(() => {
                el.sizeConstrainedSetOf(0, 4);
            });
            assert.throws(() => {
                el.sizeConstrainedSetOf(6, 8);
            });
        });
    });

    describe(`${CodecElement.constructor.name} range-constraint validator`, () => {
        it("validates an INTEGER", () => {
            const el = new CodecElement();
            el.integer = 5;
            assert.doesNotThrow(() => {
                el.rangeConstrainedInteger(1, 5);
            });
            assert.throws(() => {
                el.rangeConstrainedInteger(0, 4);
            });
            assert.throws(() => {
                el.rangeConstrainedInteger(6, 8);
            });
        });

        it("validates a REAL", () => {
            const el = new CodecElement();
            el.real = 5.5;
            assert.doesNotThrow(() => {
                el.rangeConstrainedReal(1, 5.5);
            });
            assert.throws(() => {
                el.rangeConstrainedReal(0, 4);
            });
            assert.throws(() => {
                el.rangeConstrainedReal(6, 8);
            });
        });
    });
});

