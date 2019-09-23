const asn1 = require("../../dist/index.js");
const ASN1Construction = asn1.ASN1Construction;
const ASN1SpecialRealValue = asn1.ASN1SpecialRealValue;

describe("A Basic Encoding Rules Element", () => {
    it("does not change in value when the BOOLEAN accessor is called", () => {
        const el = new asn1.BERElement();
        el.value = new Uint8Array([ 0xFF ]);
        expect(el.boolean).toBe(el.boolean);
    });

    it("does not change in value when the INTEGER accessor is called", () => {
        const el = new asn1.BERElement();
        el.value = new Uint8Array([ 0xF3 ]);
        expect(el.integer).toBe(el.integer);
    });

    it("does not change in value when the BIT STRING accessor is called", () => {
        const el = new asn1.BERElement();
        el.value = new Uint8Array([ 0x03, 0xCC ]);
        expect(el.bitString).toEqual(el.bitString);
    });

    it("does not change in value when the OCTET STRING accessor is called", () => {
        const el = new asn1.BERElement();
        el.value = new Uint8Array([ 0xFF ]);
        expect(el.octetString).toEqual(el.octetString);
    });

    it("does not change in value when the OBJECT IDENTIFIER accessor is called", () => {
        const el = new asn1.BERElement();
        el.value = new Uint8Array([ 0x42, 0x03 ]);
        expect(el.objectIdentifier).toEqual(el.objectIdentifier);
    });

    it("does not change in value when the ObjectDescriptor accessor is called", () => {
        const el = new asn1.BERElement();
        el.value = new Uint8Array([ 0x39 ]);
        expect(el.objectDescriptor).toBe(el.objectDescriptor);
    });

    it("does not change in value when the REAL accessor is called", () => {
        const el = new asn1.BERElement();
        el.value = new Uint8Array([ ASN1SpecialRealValue.plusInfinity ]);
        expect(el.real).toBe(el.real);
    });

    it("does not change in value when the ENUMERATED accessor is called", () => {
        const el = new asn1.BERElement();
        el.value = new Uint8Array([ 0xFF ]);
        expect(el.enumerated).toBe(el.enumerated);
    });

    it("does not change in value when the UTF8String accessor is called", () => {
        const el = new asn1.BERElement();
        el.value = new Uint8Array([ 0x39, 0x42 ]);
        expect(el.utf8String).toBe(el.utf8String);
    });

    it("does not change in value when the RELATIVE OID accessor is called", () => {
        const el = new asn1.BERElement();
        el.value = new Uint8Array([ 0x06, 0x03 ]);
        expect(el.relativeObjectIdentifier).toEqual(el.relativeObjectIdentifier);
    });

    it("does not change in value when the SEQUENCE accessor is called", () => {
        const el = new asn1.BERElement();
        el.construction = ASN1Construction.constructed;
        el.value = new Uint8Array([ 1, 1, 0xFF, 2, 1, 0x00 ]);
        expect(el.sequence).toEqual(el.sequence);
    });

    it("does not change in value when the SET accessor is called", () => {
        const el = new asn1.BERElement();
        el.construction = ASN1Construction.constructed;
        el.value = new Uint8Array([ 1, 1, 0xFF, 2, 1, 0x00 ]);
        expect(el.sequence).toEqual(el.sequence);
    });

    it("does not change in value when the NumericString accessor is called", () => {
        const el = new asn1.BERElement();
        el.value = new Uint8Array([ 0x39, 0x36 ]);
        expect(el.numericString).toBe(el.numericString);
    });

    it("does not change in value when the PrintableString accessor is called", () => {
        const el = new asn1.BERElement();
        el.value = new Uint8Array([ 0x39, 0x42 ]);
        expect(el.printableString).toBe(el.printableString);
    });

    it("does not change in value when the TeletexString accessor is called", () => {
        const el = new asn1.BERElement();
        el.value = new Uint8Array([ 0xFF ]);
        expect(el.teletexString).toEqual(el.teletexString);
    });

    it("does not change in value when the Videotex accessor is called", () => {
        const el = new asn1.BERElement();
        el.value = new Uint8Array([ 0xFF ]);
        expect(el.videotexString).toEqual(el.videotexString);
    });

    it("does not change in value when the IA5String accessor is called", () => {
        const el = new asn1.BERElement();
        el.value = new Uint8Array([ 0x39, 0x42 ]);
        expect(el.ia5String).toBe(el.ia5String);
    });

    // it('does not change in value when the UTCTime accessor is called', () => {
    //     const el = new asn1.BERElement();
    //     el.utcTime = new Date();
    //     expect(el.utcTime).toBe(el.utcTime);
    // });

    // it('does not change in value when the GeneralizedTime accessor is called', () => {
    //     const el = new asn1.BERElement();
    //     el.generalizedTime = new Date();
    //     expect(el.generalizedTime).toEqual(el.generalizedTime);
    // });

    it("does not change in value when the GraphicString accessor is called", () => {
        const el = new asn1.BERElement();
        el.graphicString = "asdf";
        expect(el.graphicString).toBe(el.graphicString);
    });

    it("does not change in value when the VisibleString accessor is called", () => {
        const el = new asn1.BERElement();
        el.visibleString = "asdf";
        expect(el.visibleString).toBe(el.visibleString);
    });

    it("does not change in value when the GeneralString accessor is called", () => {
        const el = new asn1.BERElement();
        el.generalString = "asdf";
        expect(el.generalString).toBe(el.generalString);
    });

    it("does not change in value when the UniversalString accessor is called", () => {
        const el = new asn1.BERElement();
        el.universalString = "asdf";
        expect(el.universalString).toBe(el.universalString);
    });

    it("does not change in value when the BMPString accessor is called", () => {
        const el = new asn1.BERElement();
        el.bmpString = "asdf";
        expect(el.bmpString).toBe(el.bmpString);
    });
});
