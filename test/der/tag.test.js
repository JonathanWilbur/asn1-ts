const asn1 = require("../../dist/index.js");
const ASN1TagClass = asn1.ASN1TagClass;
describe("Distinguished Encoding Rules", () => {
    it("decode tag class correctly", () => {
        const el = new asn1.DERElement();
        el.fromBytes(new Uint8Array([ 0xF0, 0x00 ]));
        expect(el.tagClass).toBe(ASN1TagClass.private);
    });
});
