describe('Basic Encoding Rules', () => {
    it('throws when decoding a zero-byte BOOLEAN', () => {
        let el = new BERElement();
        el.fromBytes(new Uint8Array([ 1, 0 ]));
        expect(() => el.boolean).toThrow();
    });

    it('throws when decoding a zero-byte INTEGER', () => {
        let el = new BERElement();
        el.fromBytes(new Uint8Array([ 1, 0 ]));
        expect(() => el.integer).toThrow();
    });

    it('throws when decoding a zero-byte BIT STRING', () => {
        let el = new BERElement();
        el.fromBytes(new Uint8Array([ 1, 0 ]));
        expect(() => el.bitString).toThrow();
    });

    it('throws when decoding a zero-byte OBJECT IDENTIFIER', () => {
        let el = new BERElement();
        el.fromBytes(new Uint8Array([ 1, 0 ]));
        expect(() => el.objectIdentifier).toThrow();
    });

    it('throws when decoding a zero-byte ENUMERATED', () => {
        let el = new BERElement();
        el.fromBytes(new Uint8Array([ 1, 0 ]));
        expect(() => el.enumerated).toThrow();
    });

    it('throws when decoding a zero-byte UTCTime', () => {
        let el = new BERElement();
        el.fromBytes(new Uint8Array([ 1, 0 ]));
        expect(() => el.utcTime).toThrow();
    });

    it('throws when decoding a zero-byte GeneralizedTime', () => {
        let el = new BERElement();
        el.fromBytes(new Uint8Array([ 1, 0 ]));
        expect(() => el.generalizedTime).toThrow();
    });
});