const asn1 = require("../dist/index.js");

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
