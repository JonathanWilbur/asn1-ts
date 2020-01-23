const asn1 = require("../../dist/index.js");

[
    asn1.BERElement,
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(CodecElement.constructor.name, () => {
        it("decodes tag class correctly", () => {
            const el = new CodecElement();
            el.fromBytes(new Uint8Array([ 0xF0, 0x00 ]));
            expect(el.tagClass).toBe(asn1.ASN1TagClass.private);
        });
    });
});
