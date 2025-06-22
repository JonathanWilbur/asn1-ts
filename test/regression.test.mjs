import * as asn1 from "../dist/index.mjs";
import { ASN1UniversalType, ASN1Construction, ASN1TagClass, ObjectIdentifier } from "../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert, doesNotThrow } from "node:assert";
import * as asn1fn from "../dist/functional.mjs";
import convertBytesToText from "../dist/utils/convertBytesToText.mjs";

describe("The encode() method", () => {
    it("does not fail to encode a Uint8Array", () => {
        assert.doesNotThrow(() => {
            const el = new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                asn1.ASN1UniversalType.octetString,
                new Uint8Array(8),
            );
        });
    });
});

describe("_encodeSequenceOf<UTF8String>", () => {
    it("does not crash", () => {
        const encode = asn1fn._encodeSequenceOf(
            () => asn1fn._encodeUTF8String,
            () => new asn1.DERElement(),
        );
        let el;
        assert.doesNotThrow(() => {
            el = encode([
                "hello",
                "world",
            ], () => new asn1.DERElement());
        });

        assert.equal(el.tagClass, asn1.ASN1TagClass.universal);
        assert.equal(el.construction, asn1.ASN1Construction.constructed);
        assert.equal(el.tagNumber, asn1.ASN1UniversalType.sequence);
        assert.equal(el.sequence.length, 2);
        assert.equal(el.sequence[0].tagClass, asn1.ASN1TagClass.universal);
        assert.equal(el.sequence[0].construction, ASN1Construction.primitive);
        assert.equal(el.sequence[0].tagNumber, ASN1UniversalType.utf8String);
        assert.equal(el.sequence[0].utf8String, "hello");
        assert.equal(el.sequence[1].tagClass, ASN1TagClass.universal);
        assert.equal(el.sequence[1].construction, ASN1Construction.primitive);
        assert.equal(el.sequence[1].tagNumber, ASN1UniversalType.utf8String);
        assert.equal(el.sequence[1].utf8String, "world");
    });
});

describe("Decoding", () => {
    // See: https://stackoverflow.com/questions/14680396/date-setmonth-causes-the-month-to-be-set-too-high-if-date-is-at-the-end-of-t
    it("does not fail to decode UTCTime from a Buffer", () => {
        const el = new asn1.DERElement();
        el.fromBytes(Buffer.concat([
            Buffer.from([ 23, 13 ]),
            Buffer.from("200623194348Z", "ascii"),
        ]));
        assert.doesNotThrow(() => {
            el.utcTime;
        });
    });
});

describe("The encode() method", () => {
    it("does not fail to encode a Uint8Array", () => {
        assert.doesNotThrow(() => {
            const el = new asn1.DERElement(
                asn1.ASN1TagClass.universal,
                asn1.ASN1Construction.primitive,
                asn1.ASN1UniversalType.octetString,
                new Uint8Array(8),
            );
        });
    });
});

describe("convertBytesToText", () => {
    it("does not stringify an entire buffer pool when a Buffer is passed in", () => {
        const originalString = "AAABBBCCC";
        const b = Buffer.from(originalString);
        assert.equal(convertBytesToText(b), originalString);
    });
});

describe("convertBytesToText", () => {
    it("does not stringify an entire buffer pool when a Buffer is passed in", () => {
        const originalString = "AAABBBCCC";
        const b = Buffer.from(originalString);
        assert.equal(convertBytesToText(b), originalString);
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
        assert.doesNotThrow(() => el.fromBytes(bytes));
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
        assert.throws(() => {
            $._parse_sequence(
                el,
                {},
                rctl1,
                eal,
                rctl2,
                () => { /* NOOP */ },
            );
        });
    });
});


describe("_encodeExternal", () => {
    it("encodes correctly", () => {
        const ext = new asn1.External(
            ObjectIdentifier.fromParts([ 2, 5, 4, 3 ]),
            1,
            undefined,
            asn1.DERElement.fromSequence([]),
        );
        const encoded = Buffer
            .from(asn1fn._encodeExternal(ext, asn1fn.BER).toBytes())
            .toString("hex")
            .toUpperCase();
        assert.equal(encoded, "280C0603550403020101A0023000");
        asn1fn._decodeExternal(asn1fn._encodeExternal(ext, asn1fn.BER));
    });
});


describe("ASN1Element.toString()", () => {
    it("does not error when printing a SET OF (meaning non-unique tagging)", () => {
        const el = asn1.BERElement.fromSetOf([
            asn1fn._encodeInteger(5, asn1fn.BER),
            asn1fn._encodeInteger(4, asn1fn.BER),
            asn1fn._encodeInteger(3, asn1fn.BER),
            asn1fn._encodeInteger(2, asn1fn.BER),
            asn1fn._encodeInteger(1, asn1fn.BER),
        ]);
        assert.equal(el.toString(), "{ 5 , 4 , 3 , 2 , 1 }");
    });
});

describe("ASN1Element.toJSON()", () => {
    it("does not error when printing a SET OF (meaning non-unique tagging)", () => {
        const el = asn1.BERElement.fromSetOf([
            asn1fn._encodeInteger(5, asn1fn.BER),
            asn1fn._encodeInteger(4, asn1fn.BER),
            asn1fn._encodeInteger(3, asn1fn.BER),
            asn1fn._encodeInteger(2, asn1fn.BER),
            asn1fn._encodeInteger(1, asn1fn.BER),
        ]);
        assert.deepEqual(el.toJSON(), [ 5, 4, 3, 2, 1 ]);
    });
});

describe("UTCTime and GeneralizedTime", () => {
    it("do not mis-decode dates", () => {
        const utc_str = "230628020636Z";
        const gen_str = "20230628020636Z";
        const u_el = new asn1.BERElement();
        u_el.value = Buffer.from(utc_str);

        const g_el = new asn1.BERElement();
        g_el.value = Buffer.from(gen_str);

        const u = u_el.utcTime;
        const g = g_el.generalizedTime;
        assert.equal(u.getUTCFullYear(), 2023);
        assert.equal(u.getUTCMonth(), 5);
        assert.equal(u.getUTCDate(), 28);
        assert.equal(u.getUTCHours(), 2);
        assert.equal(u.getUTCMinutes(), 6);
        assert.equal(u.getUTCSeconds(), 36);
        assert.equal(g.getUTCFullYear(), 2023);
        assert.equal(g.getUTCMonth(), 5);
        assert.equal(g.getUTCDate(), 28);
        assert.equal(g.getUTCHours(), 2);
        assert.equal(g.getUTCMinutes(), 6);
        assert.equal(g.getUTCSeconds(), 36);
    });
});

describe("UTCTime and GeneralizedTime with Timezone Offset", () => {
    it("do not mis-decode dates", () => {
        const utc_str = "230628020636Z";
        const gen_str = "20230628020636-0400";
        const u_el = new asn1.BERElement();
        u_el.value = Buffer.from(utc_str);

        const g_el = new asn1.BERElement();
        g_el.value = Buffer.from(gen_str);

        const u = u_el.utcTime;
        const g = g_el.generalizedTime;
        assert.equal(u.getUTCFullYear(), 2023);
        assert.equal(u.getUTCMonth(), 5);
        assert.equal(u.getUTCDate(), 28);
        assert.equal(u.getUTCHours(), 2);
        assert.equal(u.getUTCMinutes(), 6);
        assert.equal(u.getUTCSeconds(), 36);
        assert.equal(g.getUTCFullYear(), 2023);
        assert.equal(g.getUTCMonth(), 5);
        assert.equal(g.getUTCDate(), 28);
        assert.equal(g.getUTCHours(), 6);
        assert.equal(g.getUTCMinutes(), 6);
        assert.equal(g.getUTCSeconds(), 36);
    });
});
