// TODO: Submit bug to jasmine about how date comparison fails on Safari
let BERElement = asn1.BERElement;
let ObjectIdentifier = asn1.ObjectIdentifier;

describe("Basic Encoding Rules", function() {

    const floatingPointErrorTolerance = 1e-06;

    // it("encodes a long tag number correctly", function () {
    //     let bob = new BERElement();
    //     bob.tagNumber = 129;
    //     console.info(bob.toBytes());
    // });

    // it("encodes a long-form definite length element correctly", function () {
    //     let bob = new BERElement();
    //     bob.value = new Uint8Array(129);
    //     console.info(bob.toBytes());
    // });

    // it("encodes an indefinite-length element correctly", function () {
    //     let bob = new BERElement();
    //     BERElement.lengthEncodingPreference = asn1.LengthEncodingPreference.indefinite;
    //     bob.value = new Uint8Array(4);
    //     bob.value[1] = 2;
    //     bob.value[2] = 7;
    //     console.info(bob.toBytes());
    // });

    it("encodes and decodes a BOOLEAN correctly", function () {
        let el = new BERElement();
        el.boolean = true;
        expect(el.value).toEqual(new Uint8Array([ 0xFF ]));
        expect(el.boolean).toBe(true);
        el.boolean = false;
        expect(el.value).toEqual(new Uint8Array([ 0x00 ]));
        expect(el.boolean).toBe(false);
    });

    it("encodes and decodes an INTEGER correctly", function () {
        let el = new BERElement();
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
        let el = new BERElement();
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
        let el = new BERElement();
        el.octetString = new Uint8Array([ 255, 127, 36, 0, 1, 254 ]);
        expect(el.value).toEqual(new Uint8Array([ 255, 127, 36, 0, 1, 254 ]));
        expect(el.octetString).toEqual(new Uint8Array([ 255, 127, 36, 0, 1, 254 ]));
    });

    it("encodes and decodes an OBJECT IDENTIFIER correctly", function () {
        let el = new BERElement();
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

    it("encodes and decodes an ObjectDescriptor correctly", function () {
        let el = new BERElement();
        el.objectDescriptor = "HENLO-BORTHERS";
        expect(el.objectDescriptor).toBe("HENLO-BORTHERS");
    });

    it("encodes and decodes a REAL correctly", function () {
        let el = new BERElement();
        for (let i = -100; i < 100; i++) {
            // Alternating negative and positive floating point numbers exploring extreme values
            let num = Math.pow((i % 2 ? -1 : 1) * 1.23, i);
            el.real = num;
            expect(Math.abs(el.real - num)).toBeLessThan(floatingPointErrorTolerance);
        }

        let edgeCaseTests = [
            0.0,
            -0.0,
            (10.0 / 3.0), // Non-terminating decimal
            (-10.0 / 3.0), // Negative non-terminating decimal
            1.0,
            -1.0
        ];

        edgeCaseTests.forEach(test => {
            el.real = test;
            expect(Math.abs(el.real - test)).toBeLessThan(floatingPointErrorTolerance);
        });

        el.real = Infinity;
        expect(el.real).toBe(Infinity);

        el.real = -Infinity;
        expect(el.real).toBe(-Infinity);

        el.real = NaN;
        expect(el.real).toBeNaN();

        // These tests might fail due to overflow
        el.real = Number.MAX_VALUE;
        expect(Math.abs(el.real - Number.MAX_VALUE)).toBeLessThan(floatingPointErrorTolerance);
        el.real = Number.MIN_VALUE;
        expect(Math.abs(el.real - Number.MIN_VALUE)).toBeLessThan(floatingPointErrorTolerance);

        el.real = (Number.MAX_SAFE_INTEGER + 1.0);
        expect(Math.abs(el.real - (Number.MAX_SAFE_INTEGER + 1.0))).toBeLessThan(floatingPointErrorTolerance);
        el.real = (Number.MIN_SAFE_INTEGER - 1.0);
        expect(Math.abs(el.real - (Number.MIN_SAFE_INTEGER - 1.0))).toBeLessThan(floatingPointErrorTolerance);

        let evenMoreEdgeCases = [
            Math.E,
            Math.LN10,
            Math.LN2,
            Math.LOG10E,
            Math.LOG2E,
            Math.PI,
            Math.SQRT1_2,
            Math.SQRT2,
            (Math.SQRT2 / 2.0), // SQRT_2_OVER_2
            ((1.0 + Math.sqrt(5.0)) / 2.0), // GOLDEN_RATIO
            0.57721,      // EULER_MASCHERONI_CONSTANT
            0.2614972128, // MEISSEL_MERTENS_CONSTANT
            0.2801694990, // BERNSTEINS_CONSTANT
            0.3036630028, // GAUSS_KUZMIN_WIRSING_CONSTANT
            0.3532363718, // HAFNER_SARNAK_MCCURLEY_CONSTANT
            0.5671432904, // OMEGA_CONSTANT
            0.6243299885, // GOLOMB_DICKMAN_CONSTANT
            0.6434105462, // CAHENS_CONSTANT
            0.6601618158, // TWIN_PRIME_CONSTANT
            0.6627434193, // LAPLACE_LIMIT
            0.70258,      // LANDAU_RAMANUJAN_CONSTANT
            0.8093940205, // ALLADI_GRINSTEAD_CONSTANT
            0.87058838,   // BRUNS_CONSTANT_FOR_PRIME_QUADRUPLETS
            0.9159655941, // CATALANS_CONSTANT
            1.0986858055, // LENGYELS_CONSTANT
            1.13198824,   // VISWANATHS_CONSTANT
            1.2020569,    // APERYS_CONSTANT
            1.30357,      // CONWAYS_CONSTANT
            1.3063778838, // MILLS_CONSTANT
            1.3247179572, // PLASTIC_CONSTANT
            1.4513692348, // RAMANUJAN_SOLDNER_CONSTANT
            1.4560749485, // BACKHOUSES_CONSTANT
            1.4670780794, // PORTERS_CONSTANT
            1.5396007178, // LIEBS_SQUARE_ICE_CONSTANT
            1.6066951524, // ERDOS_BORWEIN_CONSTANT
            1.7052111401, // NIVENS_CONSTANT
            1.9021605831, // BRUNS_CONSTANT_FOR_TWIN_PRIMES
            2.2955871493, // UNIVERSAL_PARABOLIC_CONSTANT
            2.5029078750, // FEIGENBAUM_CONSTANT_ALPHA
            2.5849817595, // SIERPINSKIS_CONSTANT
            2.6854520010, // KHINCHINS_CONSTANT
            2.8077702420, // FRANSEN_ROBINSON_CONSTANT
            3.2758229187, // LEVYS_CONSTANT
            3.3598856662, // RECIPROCAL_FIBONACCI_CONSTANT
            4.6692016091, // FEIGENBAUM_CONSTANT_DELTA
            1.2824271291  // GLAISHER_KINKELIN_CONSTANT
        ];

        evenMoreEdgeCases.forEach(test => {
            el.real = test;
            expect(Math.abs(el.real - test)).toBeLessThan(floatingPointErrorTolerance);
        });
    });

    it("encodes and decodes and ENUMERATED correctly", function () {
        let el = new BERElement();
        for (let i = 0; i < 128; i++) {
            el.enumerated = i;
            expect(el.value).toEqual(new Uint8Array([ i ]));
            expect(el.enumerated).toBe(i);
        }

        for (let i = -32768; i < 32767; i++) {
            el.enumerated = i;
            expect(el.enumerated).toBe(i);
        }

        for (let i = -2147483647; i < 2147483647; i += 15485863) {
            el.enumerated = i;
            expect(el.enumerated).toBe(i);
        }
    });

    // TODO: EmbeddedPDV
    // TODO: UTF8String

    it("encodes and decodes a RELATIVE OID correctly", function () {
        let el = new BERElement();
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

        sensitiveValues.forEach(z => {
            el.relativeObjectIdentifier = [ z, 2, 3 ];
            expect(el.relativeObjectIdentifier).toEqual([ z, 2, 3 ]);
            el.relativeObjectIdentifier = [ 1, z, 3 ];
            expect(el.relativeObjectIdentifier).toEqual([ 1, z, 3 ]);
            el.relativeObjectIdentifier = [ 1, 2, z ];
            expect(el.relativeObjectIdentifier).toEqual([ 1, 2, z ]);
        });
    });

    it("encodes and decodes a SEQUENCE correctly", function () {
        let el = new BERElement();
        let subs = [];
        subs.push(new BERElement());
        subs.push(new BERElement());
        subs.push(new BERElement());
        subs[0].tagNumber = 1;
        subs[0].boolean = true;
        subs[1].tagNumber = 2;
        subs[1].boolean = false;
        subs[2].tagNumber = 3;
        subs[2].boolean = true;
        el.sequence = subs;
        expect(el.value).toEqual(new Uint8Array([ 1, 1, 255, 2, 1, 0, 3, 1, 255 ]));
        let decodedElements = el.sequence;
        expect(decodedElements.length).toBe(3);
        expect(decodedElements[0].boolean).toBe(true);
        expect(decodedElements[1].boolean).toBe(false);
        expect(decodedElements[2].boolean).toBe(true);
    });

    it("encodes and decodes a SET correctly", function () {
        let el = new BERElement();
        let subs = [];
        subs.push(new BERElement());
        subs.push(new BERElement());
        subs.push(new BERElement());
        subs[0].tagNumber = 1;
        subs[0].boolean = true;
        subs[1].tagNumber = 2;
        subs[1].boolean = false;
        subs[2].tagNumber = 3;
        subs[2].boolean = true;
        el.set = subs;
        expect(el.value).toEqual(new Uint8Array([ 1, 1, 255, 2, 1, 0, 3, 1, 255 ]));
        let decodedElements = el.set;
        expect(decodedElements.length).toBe(3);
        expect(decodedElements[0].boolean).toBe(true);
        expect(decodedElements[1].boolean).toBe(false);
        expect(decodedElements[2].boolean).toBe(true);
    });

    it("encodes and decodes a NumericString correctly", function () {
        let el = new BERElement();
        el.numericString = "12345 67890";
        expect(el.numericString).toBe("12345 67890");
    });

    it("encodes and decodes a PrintableString correctly", function () {
        let el = new BERElement();
        el.printableString = "12345abcdef '()+,-./:=?";
        expect(el.printableString).toBe("12345abcdef '()+,-./:=?");
    });

    it("encodes and decodes a UTCTime correctly", function () {
        let el = new BERElement();
        let test = new Date();
        el.utcTime = test;
        let ret = el.utcTime;

        /** NOTE:
         * You have to compare each member of the Date object individually,
         * because the methods do not read or write milliseconds.
         */
        expect(ret.getUTCFullYear()).toBe(test.getUTCFullYear());
        expect(ret.getUTCMonth()).toBe(test.getUTCMonth());
        expect(ret.getUTCDate()).toBe(test.getUTCDate());
        expect(ret.getUTCHours()).toBe(test.getUTCHours());
        expect(ret.getUTCMinutes()).toBe(test.getUTCMinutes());
        expect(ret.getUTCSeconds()).toBe(test.getUTCSeconds());
    });

    it("encodes and decodes a GeneralizedTime correctly", function () {
        let el = new BERElement();
        let test = new Date();
        el.generalizedTime = test;
        let ret = el.generalizedTime;

        /** NOTE:
         * You have to compare each member of the Date object individually,
         * because the methods do not read or write milliseconds.
         */
        expect(ret.getUTCFullYear()).toBe(test.getUTCFullYear());
        expect(ret.getUTCMonth()).toBe(test.getUTCMonth());
        expect(ret.getUTCDate()).toBe(test.getUTCDate());
        expect(ret.getUTCHours()).toBe(test.getUTCHours());
        expect(ret.getUTCMinutes()).toBe(test.getUTCMinutes());
        expect(ret.getUTCSeconds()).toBe(test.getUTCSeconds());
    });

    it("encodes and decodes a BMPString correctly", function () {
        let el = new BERElement();
        el.bmpString = "HENLOBORTHERS";
        expect(el.bmpString).toBe("HENLOBORTHERS");
    });

});
