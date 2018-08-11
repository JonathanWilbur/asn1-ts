let BERElement = asn1.BERElement;
let ObjectIdentifier = asn1.ObjectIdentifier;

describe("Basic Encoding Rules", function() {

    let x = new BERElement();

    it("encodes and decodes a BOOLEAN correctly", function () {
        x.boolean = true;
        expect(x.value).toEqual(new Uint8Array([ 0xFF ]));
        expect(x.boolean).toBe(true);
        x.boolean = false;
        expect(x.value).toEqual(new Uint8Array([ 0x00 ]));
        expect(x.boolean).toBe(false);
    });

    it("encodes and decodes an INTEGER correctly", function () {
        for (let i = 0; i < 128; i++) {
            x.integer = i;
            expect(x.value).toEqual(new Uint8Array([ i ]));
            expect(x.integer).toBe(i);
        }

        for (let i = -32768; i < 32767; i++) {
            x.integer = i;
            expect(x.integer).toBe(i);
        }

        for (let i = -2147483647; i < 2147483647; i += 15485863) {
            x.integer = i;
            expect(x.integer).toBe(i);
        }
    });

    it("encodes and decodes a BIT STRING correctly", function () {
        x.bitString = []; // 0 bits
        (x.bitString == []);
        x.bitString = [ true, false, true, true, false, false, true ]; // 7 bits
        expect(x.bitString).toEqual([ true, false, true, true, false, false, true ]);
        x.bitString = [ true, false, true, true, false, false, true, false ]; // 8 bits
        expect(x.bitString).toEqual([ true, false, true, true, false, false, true, false ]);
        x.bitString = [ true, false, true, true, false, false, true, false, true ]; // 9 bits
        expect(x.bitString).toEqual([ true, false, true, true, false, false, true, false, true ]);

        x.bitString = [ true, false, true, true, false, true, true, true, false, true ];
        expect(x.value).toEqual(new Uint8Array([ 6, 183, 64 ]));
        expect(x.bitString).toEqual([ true, false, true, true, false, true, true, true, false, true ]);
    });

    it("encodes and decodes an OCTET STRING correctly", function () {
        x.octetString = new Uint8Array([ 255, 127, 36, 0, 1, 254 ]);
        expect(x.value).toEqual(new Uint8Array([ 255, 127, 36, 0, 1, 254 ]));
        expect(x.octetString).toEqual(new Uint8Array([ 255, 127, 36, 0, 1, 254 ]));
    });

    it("encodes and decodes an OBJECT IDENTIFIER correctly", function () {
        x.objectIdentifier = new ObjectIdentifier([ 1, 3, 4, 6, 3665, 90 ]);
        expect(x.objectIdentifier).toEqual(new ObjectIdentifier([ 1, 3, 4, 6, 3665, 90 ]));
    });
});
