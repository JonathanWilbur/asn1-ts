const asn1 = require("../dist/node/index.js");
const asn1fn = require("../dist/node/functional");
const { ASN1UniversalType, ASN1Construction, ASN1TagClass, ObjectIdentifier } = require("../dist/node/index.js");
const convertBytesToText = require("../dist/node/utils/convertBytesToText").default;

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

describe("convertBytesToText", () => {
    it("does not stringify an entire buffer pool when a Buffer is passed in", () => {
        const originalString = "AAABBBCCC";
        const b = Buffer.from(originalString);
        expect(convertBytesToText(b)).toBe(originalString);
    });
});

describe("convertBytesToText", () => {
    it("does not stringify an entire buffer pool when a Buffer is passed in", () => {
        const originalString = "AAABBBCCC";
        const b = Buffer.from(originalString);
        expect(convertBytesToText(b)).toBe(originalString);
    });
});


[
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(`${CodecElement.constructor.name}.fromBytes()`, () => {
        // Credits to https://github.com/Axel-EH for discovering this. Thank you!
        const bytes = Buffer.from([ 0x5F, 0x1F, 0x02, 0x48, 0x69 ]);
        const el = new CodecElement();
        expect(() => el.fromBytes(bytes)).not.toThrow();
    });
});

describe("ACSE RLRQ APDU", () => {
    const $ = asn1fn;
    const rctl1 = [
        new $.ComponentSpec(
            "reason",
            true,
            $.hasTag(ASN1TagClass.context, 0),
            undefined,
            undefined,
        ),
    ];
    const rctl2 = [
        new $.ComponentSpec(
            "user-information",
            true,
            $.hasTag(ASN1TagClass.context, 30),
            undefined,
            undefined,
        ),
    ];
    const eal = [
        new $.ComponentSpec(
            "aso-qualifier",
            true,
            $.hasTag(ASN1TagClass.context, 13),
            undefined,
            undefined,
        ),
        new $.ComponentSpec(
            "asoi-identifier",
            true,
            $.hasTag(ASN1TagClass.context, 14),
            undefined,
            undefined,
        ),
    ];
    it("with extensions and no trailing root component type list elements can be decoded correctly", () => {
        /**
         * This has an unrecognized extension that is an OCTET STRING of 10
         * bytes.
         */
        const bytes = Buffer.from("620f800100040a8e44228c90526d5ad38a", "hex");
        const el = new asn1.BERElement();
        el.fromBytes(bytes);
        $._parse_sequence(
            el,
            {},
            rctl1,
            eal,
            rctl2,
            () => { /* NOOP */ },
        );
    });

    it("with trailing unrecognized component throws", () => {
        const el = asn1.BERElement.fromSequence([
            $._encode_explicit(ASN1TagClass.context, 0, () => $._encodeInteger, $.BER)(0, $.BER),
            $._encode_explicit(ASN1TagClass.context, 30, () => $._encodeSequence, $.BER)([], $.BER),
            $._encode_explicit(ASN1TagClass.context, 21, () => $._encodeInteger, $.BER)(6, $.BER),
            // asn1.BERElement.fromSequence([]),
            // $._encode_implicit(ASN1TagClass.context, 30, $.BER)($._encodeSequenceOf([], $.BER)),
            // $._encode_explicit(ASN1TagClass.context, 8, $._encodeInteger, $.BER)($._encodeInteger(0, $.BER)),
        ]);
        expect(() => {
            $._parse_sequence(
                el,
                {},
                rctl1,
                eal,
                rctl2,
                () => { /* NOOP */ },
            );
        }).toThrow();
    });
});


describe("_encodeExternal", () => {
    it("encodes correctly", () => {
        const ext = new asn1.External(
            new ObjectIdentifier([ 2, 5, 4, 3 ]),
            1,
            undefined,
            asn1.DERElement.fromSequence([]),
        );
        const encoded = Buffer
            .from(asn1fn._encodeExternal(ext, asn1fn.BER).toBytes())
            .toString("hex")
            .toUpperCase();
        expect(encoded).toBe("280C0603550403020101A0023000");
        asn1fn._decodeExternal(asn1fn._encodeExternal(ext, asn1fn.BER));
    });
});
