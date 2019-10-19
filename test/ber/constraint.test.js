const asn1 = require("../../dist/index.js");

describe("Basic Encoding Rules size-constraint validator", () => {
    it("validates a BIT STRING", () => {
        const el = new asn1.BERElement();
        el.bitString = [ true, false, true, false, true ];
        expect(() => {
            el.sizeConstrainedBitString(1, 5);
        }).not.toThrow();
        expect(() => {
            el.sizeConstrainedBitString(0, 4);
        }).toThrow();
        expect(() => {
            el.sizeConstrainedBitString(6, 8);
        }).toThrow();
    });

    it("validates an OCTET STRING", () => {
        const el = new asn1.BERElement();
        el.octetString = new Uint8Array([ 1, 2, 3, 4, 5 ]);
        expect(() => {
            el.sizeConstrainedOctetString(1, 5);
        }).not.toThrow();
        expect(() => {
            el.sizeConstrainedOctetString(0, 4);
        }).toThrow();
        expect(() => {
            el.sizeConstrainedOctetString(6, 8);
        }).toThrow();
    });

    // I am not going to test all of the string types.
    it("validates an ObjectDescriptor", () => {
        const el = new asn1.BERElement();
        el.objectDescriptor = "bloop";
        expect(() => {
            el.sizeConstrainedObjectDescriptor(1, 5);
        }).not.toThrow();
        expect(() => {
            el.sizeConstrainedObjectDescriptor(0, 4);
        }).toThrow();
        expect(() => {
            el.sizeConstrainedObjectDescriptor(6, 8);
        }).toThrow();
    });

    it("validates a SEQUENCE OF", () => {
        const el = new asn1.BERElement();
        el.sequence = [
            new asn1.BERElement(),
            new asn1.BERElement(),
            new asn1.BERElement(),
            new asn1.BERElement(),
            new asn1.BERElement(),
        ];
        expect(() => {
            el.sizeConstrainedSequenceOf(1, 5);
        }).not.toThrow();
        expect(() => {
            el.sizeConstrainedSequenceOf(0, 4);
        }).toThrow();
        expect(() => {
            el.sizeConstrainedSequenceOf(6, 8);
        }).toThrow();
    });

    it("validates a SET OF", () => {
        const el = new asn1.BERElement();
        el.set = [
            new asn1.BERElement(),
            new asn1.BERElement(),
            new asn1.BERElement(),
            new asn1.BERElement(),
            new asn1.BERElement(),
        ];
        expect(() => {
            el.sizeConstrainedSetOf(1, 5);
        }).not.toThrow();
        expect(() => {
            el.sizeConstrainedSetOf(0, 4);
        }).toThrow();
        expect(() => {
            el.sizeConstrainedSetOf(6, 8);
        }).toThrow();
    });
});

describe("Basic Encoding Rules range-constraint validator", () => {
    it("validates an INTEGER", () => {
        const el = new asn1.BERElement();
        el.integer = 5;
        expect(() => {
            el.rangeConstrainedInteger(1, 5);
        }).not.toThrow();
        expect(() => {
            el.rangeConstrainedInteger(0, 4);
        }).toThrow();
        expect(() => {
            el.rangeConstrainedInteger(6, 8);
        }).toThrow();
    });

    it("validates a REAL", () => {
        const el = new asn1.BERElement();
        el.real = 5.5;
        expect(() => {
            el.rangeConstrainedReal(1, 5.5);
        }).not.toThrow();
        expect(() => {
            el.rangeConstrainedReal(0, 4);
        }).toThrow();
        expect(() => {
            el.rangeConstrainedReal(6, 8);
        }).toThrow();
    });
});
