describe('Basic Encoding Rules', () => {
    it('throws when decoding an element with a truncated tag number', () => {
        let el = new BERElement();
        expect(() => el.fromBytes(new Uint8Array([ 31, 0x80, 0x06  ]))).toThrow();
    });

    it('throws when decoding a truncated OBJECT IDENTIFIER', () => {
        let el = new BERElement();
        el.fromBytes(new Uint8Array([ 1, 2, 0x42, 0x80 ]));
        expect(() => el.objectIdentifier).toThrow();
    });

    it('throws when decoding a truncated RELATIVE OID', () => {
        let el = new BERElement();
        el.fromBytes(new Uint8Array([ 1, 2, 0x80, 0x81 ]));
        expect(() => el.relativeObjectIdentifier).toThrow();
    });

    it('throws when decoding a truncated UniversalString', () => {
        let el = new BERElement();
        el.fromBytes(new Uint8Array([ 1, 3, 0x00, 0x00, 0x00 ]));
        expect(() => el.universalString).toThrow();
    });

    it('throws when decoding a truncated BMPString', () => {
        let el = new BERElement();
        el.fromBytes(new Uint8Array([ 1, 1, 0x00 ]));
        expect(() => el.bmpString).toThrow();
    });
});