const asn1 = require("../dist/node/index.js");
const asn1fn = require("../dist/node/functional");
const { ASN1UniversalType, ASN1Construction, ASN1TagClass } = require("../dist/node/index.js");

describe("The encode() method", () => {
    it("does not fail to encode a Uint8Array", () => {
        expect(() => {
            const el = new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                asn1.ASN1UniversalType.octetString,
                new Uint8Array(8),
            );
        }).not.toThrow();
    });
});

describe("_encodeSequenceOf<UTF8String>", () => {
    it("does not crash", () => {
        const encode = asn1fn._encodeSequenceOf(
            () => asn1fn._encodeUTF8String,
            () => new asn1.DERElement(),
        );
        let el;
        expect(() => {
            el = encode([
                "hello",
                "world",
            ], () => new asn1.DERElement());
        }).not.toThrow();

        expect(el.tagClass).toBe(ASN1TagClass.universal);
        expect(el.construction).toBe(ASN1Construction.constructed);
        expect(el.tagNumber).toBe(ASN1UniversalType.sequence);
        expect(el.sequence.length).toBe(2);
        expect(el.sequence[0].tagClass).toBe(ASN1TagClass.universal);
        expect(el.sequence[0].construction).toBe(ASN1Construction.primitive);
        expect(el.sequence[0].tagNumber).toBe(ASN1UniversalType.utf8String);
        expect(el.sequence[0].utf8String).toBe("hello");
        expect(el.sequence[1].tagClass).toBe(ASN1TagClass.universal);
        expect(el.sequence[1].construction).toBe(ASN1Construction.primitive);
        expect(el.sequence[1].tagNumber).toBe(ASN1UniversalType.utf8String);
        expect(el.sequence[1].utf8String).toBe("world");
    });
});

describe("Decoding", () => {
    it("does not fail to decode UTCTime from a Buffer", () => {
        const el = new asn1.DERElement();
        el.fromBytes(Buffer.concat([
            Buffer.from([ 23, 13 ]),
            Buffer.from("200623194348Z", "ascii"),
        ]));
        expect(() => {
            el.utcTime;
        }).not.toThrow();
    });
});
