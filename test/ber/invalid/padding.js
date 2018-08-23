describe('Basic Encoding Rules', () => {
    it('throws when decoding an element with unnecessary padding bytes on the tag number', () => {
        let el = new BERElement();
        expect(() => el.fromBytes(new Uint8Array([ 31, 0x80, 0x06  ]))).toThrow();
    });

    it('throws when decoding an INTEGER with unnecessary padding', () => {
        let el = new BERElement();
        el.fromBytes(new Uint8Array([ 1, 3, 0xFF, 0xFF, 0xF3 ]));
        expect(() => el.integer).toThrow();
    });

    // TODO: Ensure that an OID with 0x80 in the middle of a number does not throw
    it('throws when decoding an OBJECT IDENTIFIER with unnecessary padding', () => {
        let el = new BERElement();
        el.fromBytes(new Uint8Array([ 1, 3, 0x42, 0x80, 0x06 ]));
        expect(() => el.objectIdentifier).toThrow();
    });

    it('throws when decoding an ENUMERATED with unnecessary padding', () => {
        let el = new BERElement();
        el.fromBytes(new Uint8Array([ 1, 3, 0xFF, 0xFF, 0xF3 ]));
        expect(() => el.enumerated).toThrow();
    });

    // TODO: Ensure that an OID with 0x80 in the middle of a number does not throw
    it('throws when decoding a RELATIVE OID with unnecessary padding', () => {
        let el = new BERElement();
        el.fromBytes(new Uint8Array([ 1, 2, 0x80, 0x06 ]));
        expect(() => el.relativeObjectIdentifier).toThrow();
    });
});