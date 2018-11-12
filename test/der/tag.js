let ASN1TagClass = asn1.ASN1TagClass;
describe('Distinguished Encoding Rules', () => {
    it('decode tag class correctly', () => {
        const el = new DERElement();
        el.fromBytes(new Uint8Array([ 0xF0, 0x00 ]));
        expect(el.tagClass).toBe(ASN1TagClass.private);
    });
});