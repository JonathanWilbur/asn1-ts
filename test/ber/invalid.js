let ASN1SizeError = asn1.ASN1SizeError;

/**
 * Until the issue linked below is fixed, all of these tests can only ensure
 * that an error is thrown, but not that a specific type of error is thrown.
 * See https://github.com/jasmine/jasmine/issues/819.
 */
describe("Basic Encoding Rules", function() {

    it("throws an exception when decoding a multi-byte BOOLEAN", function () {
        let el = new BERElement();
        el.fromBytes(new Uint8Array([ 1, 0, 1, 1 ]));
        expect(() => el.boolean).toThrow();
    });

    it('throws an exception when decoding a BIT STRING with a deceptive first byte', () => {
        let el = new BERElement();
        el.fromBytes(new Uint8Array([ 1, 1, 5 ]));
        expect(() => el.bitString).toThrow();
    });

    it('throws an exception when decoding a BIT STRING with a first byte greater than 7', () => {
        let el = new BERElement();
        el.fromBytes(new Uint8Array([ 1, 1, 8 ]));
        expect(() => el.bitString).toThrow();
    });

    it('throws an exception when decoding a GeneralizedTime with trailing zeroes', () => {
        let el = new BERElement();
        el.utf8String = "20181211223344.060Z";
        expect(() => el.generalizedTime).toThrow();
    });
});
