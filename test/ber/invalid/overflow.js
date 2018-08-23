describe('Basic Encoding Rules', () => {
    it('throws when decoding an excessively large INTEGER', () => {
        let el = new BERElement();
        el.fromBytes(new Uint8Array([ 1, 5, 0xFF, 0xFF, 0xFF, 0xFF, 0xF3 ]));
        expect(() => el.integer).toThrow();
    });

    it('throws when decoding an OBJECT IDENTIFIER that contains an excessively large number', () => {
        let el = new BERElement();
        el.fromBytes(new Uint8Array([ 1, 9, 0x43, 0x8F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ]));
        expect(() => el.objectIdentifier).toThrow();
    });

    it('throws when decoding an excessively large ENUMERATED', () => {
        let el = new BERElement();
        el.fromBytes(new Uint8Array([ 1, 5, 0xFF, 0xFF, 0xFF, 0xFF, 0xF3 ]));
        expect(() => el.enumerated).toThrow();
    });

    it('throws when decoding a RELATIVE OID that contains an excessively large number', () => {
        let el = new BERElement();
        el.fromBytes(new Uint8Array([ 1, 8, 0x8F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ]));
        expect(() => el.relativeObjectIdentifier).toThrow();
    });
});