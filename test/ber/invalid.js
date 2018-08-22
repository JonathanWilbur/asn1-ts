// let BERElement = asn1.BERElement;
// let ObjectIdentifier = asn1.ObjectIdentifier;
let ASN1SizeError = asn1.ASN1SizeError;

/** NOTE:
 * Blocked until error inheritance works with Jasmine, which might be never.
 * See https://github.com/jasmine/jasmine/issues/819.
 */
describe("Basic Encoding Rules", function() {

    // it("throws an exception when decoding a zero-byte BOOLEAN", function () {
    //     let data = new Uint8Array([ 1, 0 ]);
    //     let el = new BERElement();
    //     el.fromBytes(data);
    //     expect(() => { return el.boolean; }).toThrowError(ASN1SizeError);
    // });

});
