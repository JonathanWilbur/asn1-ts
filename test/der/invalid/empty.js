describe('Distinguished Encoding Rules', () => {
    it('throws when decoding a zero-byte BOOLEAN', () => {
        const el = new DERElement();
        el.value = new Uint8Array(0);
        expect(() => el.boolean).toThrow();
    });

    it('throws when decoding a zero-byte INTEGER', () => {
        const el = new DERElement();
        el.value = new Uint8Array(0);
        expect(() => el.integer).toThrow();
    });

    it('throws when decoding a zero-byte BIT STRING', () => {
        const el = new DERElement();
        el.value = new Uint8Array(0);
        expect(() => el.bitString).toThrow();
    });

    it('throws when decoding a zero-byte OBJECT IDENTIFIER', () => {
        const el = new DERElement();
        el.value = new Uint8Array(0);
        expect(() => el.objectIdentifier).toThrow();
    });

    it('throws when decoding a zero-byte ENUMERATED', () => {
        const el = new DERElement();
        el.value = new Uint8Array(0);
        expect(() => el.enumerated).toThrow();
    });

    it('throws when decoding a zero-byte UTCTime', () => {
        const el = new DERElement();
        el.value = new Uint8Array(0);
        expect(() => el.utcTime).toThrow();
    });

    it('throws when decoding a zero-byte GeneralizedTime', () => {
        const el = new DERElement();
        el.value = new Uint8Array(0);
        expect(() => el.generalizedTime).toThrow();
    });
});