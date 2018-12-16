describe('Basic Encoding Rules', () => {
    it('throws when decoding an element with unnecessary padding bytes on the tag number', () => {
        const el = new BERElement();
        expect(() => el.fromBytes(new Uint8Array([ 31, 0x80, 0x06  ]))).toThrow();
    });

    it('throws when decoding an INTEGER with unnecessary padding', () => {
        const el = new BERElement();
        el.value = new Uint8Array([ 0xFF, 0xFF, 0xF3 ]);
        expect(() => el.integer).toThrow();
    });

    it('throws when decoding an OBJECT IDENTIFIER with unnecessary padding', () => {
        const el = new BERElement();
        el.value = new Uint8Array([ 0x42, 0x80, 0x06 ]);
        expect(() => el.objectIdentifier).toThrow();
    });

    it('throws when decoding an ENUMERATED with unnecessary padding', () => {
        const el = new BERElement();
        el.value = new Uint8Array([ 0xFF, 0xFF, 0xF3 ]);
        expect(() => el.enumerated).toThrow();
    });

    it('throws when decoding a RELATIVE OID with unnecessary padding', () => {
        const el = new BERElement();
        el.value = new Uint8Array([ 0x80, 0x06 ]);
        expect(() => el.relativeObjectIdentifier).toThrow();
    });
});