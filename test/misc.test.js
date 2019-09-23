const asn1 = require("../dist/index.js");
const MAX_SINT_32 = asn1.MAX_SINT_32;
const MIN_SINT_32 = asn1.MIN_SINT_32;
const MAX_UINT_32 = asn1.MAX_UINT_32;
const MIN_UINT_32 = asn1.MIN_UINT_32;
const ASN1Element = asn1.ASN1Element;

describe("The unsigned big-endian integer decoder", () => {
    it("decodes MIN_UINT_32 correctly", () => {
        const data = new Uint8Array([
            0x00, 0x00, 0x00, 0x00,
        ]);
        expect(ASN1Element.decodeUnsignedBigEndianInteger(data)).toBe(MIN_UINT_32);
    });

    it("decodes 65535 correctly", () => {
        const data = new Uint8Array([
            0xFF, 0xFF,
        ]);
        expect(ASN1Element.decodeUnsignedBigEndianInteger(data)).toBe(65535);
    });

    it("decodes MAX_UINT_32 correctly", () => {
        const data = new Uint8Array([
            0xFF, 0xFF, 0xFF, 0xFF,
        ]);
        expect(ASN1Element.decodeUnsignedBigEndianInteger(data)).toBe(MAX_UINT_32);
    });
});

describe("The signed big-endian integer decoder", () => {
    it("decodes zero correctly", () => {
        const data = new Uint8Array([
            0x00, 0x00, 0x00, 0x00,
        ]);
        expect(ASN1Element.decodeSignedBigEndianInteger(data)).toBe(0);
    });

    it("decodes 65535 correctly", () => {
        const data = new Uint8Array([
            0xFF, 0xFF,
        ]);
        expect(ASN1Element.decodeSignedBigEndianInteger(data)).toBe(-1);
    });

    it("decodes MIN_SINT_32 correctly", () => {
        const data = new Uint8Array([
            0x80, 0x00, 0x00, 0x00,
        ]);
        expect(ASN1Element.decodeSignedBigEndianInteger(data)).toBe(MIN_SINT_32);
    });

    it("decodes MAX_SINT_32 correctly", () => {
        const data = new Uint8Array([
            0x7F, 0xFF, 0xFF, 0xFF,
        ]);
        expect(ASN1Element.decodeSignedBigEndianInteger(data)).toBe(MAX_SINT_32);
    });
});
