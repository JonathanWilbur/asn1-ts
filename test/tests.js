let BERElement = asn1.BERElement;
let ObjectIdentifier = asn1.ObjectIdentifier;

describe("Basic Encoding Rules", function() {

    let el = new BERElement();

    it("encodes and decodes a BOOLEAN correctly", function () {
        el.boolean = true;
        expect(el.value).toEqual(new Uint8Array([ 0xFF ]));
        expect(el.boolean).toBe(true);
        el.boolean = false;
        expect(el.value).toEqual(new Uint8Array([ 0x00 ]));
        expect(el.boolean).toBe(false);
    });

    it("encodes and decodes an INTEGER correctly", function () {
        for (let i = 0; i < 128; i++) {
            el.integer = i;
            expect(el.value).toEqual(new Uint8Array([ i ]));
            expect(el.integer).toBe(i);
        }

        for (let i = -32768; i < 32767; i++) {
            el.integer = i;
            expect(el.integer).toBe(i);
        }

        for (let i = -2147483647; i < 2147483647; i += 15485863) {
            el.integer = i;
            expect(el.integer).toBe(i);
        }
    });

    it("encodes and decodes a BIT STRING correctly", function () {
        el.bitString = []; // 0 bits
        (el.bitString == []);
        el.bitString = [ true, false, true, true, false, false, true ]; // 7 bits
        expect(el.bitString).toEqual([ true, false, true, true, false, false, true ]);
        el.bitString = [ true, false, true, true, false, false, true, false ]; // 8 bits
        expect(el.bitString).toEqual([ true, false, true, true, false, false, true, false ]);
        el.bitString = [ true, false, true, true, false, false, true, false, true ]; // 9 bits
        expect(el.bitString).toEqual([ true, false, true, true, false, false, true, false, true ]);

        el.bitString = [ true, false, true, true, false, true, true, true, false, true ];
        expect(el.value).toEqual(new Uint8Array([ 6, 183, 64 ]));
        expect(el.bitString).toEqual([ true, false, true, true, false, true, true, true, false, true ]);
    });

    it("encodes and decodes an OCTET STRING correctly", function () {
        el.octetString = new Uint8Array([ 255, 127, 36, 0, 1, 254 ]);
        expect(el.value).toEqual(new Uint8Array([ 255, 127, 36, 0, 1, 254 ]));
        expect(el.octetString).toEqual(new Uint8Array([ 255, 127, 36, 0, 1, 254 ]));
    });

    it("encodes and decodes an OBJECT IDENTIFIER correctly", function () {
        el.objectIdentifier = new ObjectIdentifier([ 1, 3, 4, 6, 3665, 90 ]);
        expect(el.objectIdentifier).toEqual(new ObjectIdentifier([ 1, 3, 4, 6, 3665, 90 ]));

        let sensitiveValues = [
            0,
            1,
            2,
            3,
            7,
            8,
            126,
            127,
            128,
            254,
            255,
            256,
            32766,
            32767,
            32768,
            65534,
            65535,
            65536,
            2147483646,
            2147483647
        ];

        for (let x = 0; x < 2; x++) {
            for (let y = 0; y < 40; y++) {
                sensitiveValues.forEach(z => {
                    el.objectIdentifier = new ObjectIdentifier([ x, y, 6, 4, z ]);
                    expect(el.objectIdentifier).toEqual(new ObjectIdentifier([ x, y, 6, 4, z ]));
                    el.objectIdentifier = new ObjectIdentifier([ x, y, 6, 4, z, 0 ]);
                    expect(el.objectIdentifier).toEqual(new ObjectIdentifier([ x, y, 6, 4, z, 0 ]));
                    el.objectIdentifier = new ObjectIdentifier([ x, y, 6, 4, z, 1 ]);
                    expect(el.objectIdentifier).toEqual(new ObjectIdentifier([ x, y, 6, 4, z, 1 ]));
                });
            }
        }

        for (let y = 0; y < 175; y++) {
            sensitiveValues.forEach(z => {
                el.objectIdentifier = new ObjectIdentifier([ 2, y, 6, 4, z ]);
                expect(el.objectIdentifier).toEqual(new ObjectIdentifier([ 2, y, 6, 4, z ]));
                el.objectIdentifier = new ObjectIdentifier([ 2, y, 6, 4, z, 0 ]);
                expect(el.objectIdentifier).toEqual(new ObjectIdentifier([ 2, y, 6, 4, z, 0 ]));
                el.objectIdentifier = new ObjectIdentifier([ 2, y, 6, 4, z, 1 ]);
                expect(el.objectIdentifier).toEqual(new ObjectIdentifier([ 2, y, 6, 4, z, 1 ]));
            });
        }
    });
});
