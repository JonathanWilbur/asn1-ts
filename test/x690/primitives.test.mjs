import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

// Thanks, ChatGPT 4o.
function areFloatsEqual(a, b) {
    // return Math.abs(a - b) < epsilon;
    return a.toFixed(8) === b.toFixed(8);
}

[
    asn1.BERElement,
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(CodecElement.constructor.name, () => {
        const floatingPointErrorTolerance = 1e-05;
        const EXPECTED_DIGITS_OF_PRECISION = 5;

        // it('encodes a long tag number correctly', () => {
        //     let bob = new CodecElement();
        //     bob.tagNumber = 129;
        //     console.info(bob.toBytes());
        // });

        // it('encodes a long-form definite length element correctly', () => {
        //     let bob = new CodecElement();
        //     bob.value = new Uint8Array(129);
        //     console.info(bob.toBytes());
        // });

        // it('encodes an indefinite-length element correctly', () => {
        //     let bob = new CodecElement();
        //     CodecElement.lengthEncodingPreference = asn1.LengthEncodingPreference.indefinite;
        //     bob.value = new Uint8Array(4);
        //     bob.value[1] = 2;
        //     bob.value[2] = 7;
        //     console.info(bob.toBytes());
        // });

        it("encodes and decodes a BOOLEAN correctly", () => {
            const el = new CodecElement();
            el.boolean = true;
            assert.deepEqual(el.value, new Uint8Array([ 0xFF ]));
            assert.equal(el.boolean, true);
            el.boolean = false;
            assert.deepEqual(el.value, new Uint8Array([ 0x00 ]));
            assert.equal(el.boolean, false);
        });

        it("encodes and decodes an INTEGER correctly", () => {
            const el = new CodecElement();

            // Examples taken from here: http://luca.ntop.org/Teaching/Appunti/asn1.html
            el.integer = 0;
            assert.deepEqual(el.value, Buffer.from([ 0x00 ]));
            assert.equal(el.integer, 0);
            el.integer = 127;
            assert.deepEqual(el.value, Buffer.from([ 0x7F ]));
            assert.equal(el.integer, 127);
            el.integer = 128;
            assert.deepEqual(el.value, Buffer.from([ 0x00, 0x80 ]));
            assert.equal(el.integer, 128);
            el.integer = 256;
            assert.deepEqual(el.value, Buffer.from([ 0x01, 0x00 ]));
            assert.equal(el.integer, 256);
            el.integer = -128;
            assert.deepEqual(el.value, Buffer.from([ 0x80 ]));
            assert.equal(el.integer, -128);
            el.integer = -129;
            assert.deepEqual(el.value, Buffer.from([ 0xFF, 0x7F ]));
            assert.equal(el.integer, -129);

            for (let i = 0; i < 127; i++) {
                el.integer = i;
                assert.deepEqual(el.value, Buffer.from([ i ]));
                assert.equal(el.integer, i);
            }

            for (let i = -32768; i < 32767; i++) {
                el.integer = i;
                assert.equal(el.integer, i);
            }

            for (let i = -2147483647; i < 2147483647; i += 15485863) {
                el.integer = i;
                assert(el.integer == i); // Must be "==" because we are comparing a BigInt to a number.
            }

            el.integer = BigInt("6392757259646");
            assert(el.integer == BigInt("6392757259646"));

            el.integer = (BigInt(-1) * BigInt("6392757259646"));
            assert(el.integer == (BigInt(-1) * BigInt("6392757259646")));

            el.integer = BigInt("4209759197917957569175245526786543");
            assert(el.integer == BigInt("4209759197917957569175245526786543"));

            el.integer = (BigInt(-1) * BigInt("4209759197917957569175245526786543"));
            assert(el.integer == (BigInt(-1) * BigInt("4209759197917957569175245526786543")));
        });

        it("encodes and decodes a BIT STRING correctly", () => {
            const el = new CodecElement();
            el.bitString = new Uint8ClampedArray(0); // 0 bits
            assert.deepEqual(el.bitString.length, 0);
            assert.deepEqual(el.value, new Uint8Array([ 0x00 ]));
            el.bitString = new Uint8ClampedArray([ 1, 0, 1, 1, 0, 0, 1 ]); // 7 bits
            assert.deepEqual(el.bitString, new Uint8ClampedArray([ 1, 0, 1, 1, 0, 0, 1 ]));
            el.bitString = new Uint8ClampedArray([ 1, 0, 1, 1, 0, 0, 1, 0 ]); // 8 bits
            assert.deepEqual(el.bitString, new Uint8ClampedArray([ 1, 0, 1, 1, 0, 0, 1, 0 ]));
            el.bitString = new Uint8ClampedArray([ 1, 0, 1, 1, 0, 0, 1, 0, 1 ]); // 9 bits
            assert.deepEqual(el.bitString, new Uint8ClampedArray([ 1, 0, 1, 1, 0, 0, 1, 0, 1 ]));

            el.bitString = new Uint8ClampedArray([ 1, 0, 1, 1, 0, 1, 1, 1, 0, 1 ]);
            assert.deepEqual(el.value, new Uint8Array([ 6, 183, 64 ]));
            assert.deepEqual(el.bitString, new Uint8ClampedArray([ 1, 0, 1, 1, 0, 1, 1, 1, 0, 1 ]));
        });

        it("encodes and decodes an OCTET STRING correctly", () => {
            const el = new CodecElement();
            el.octetString = new Uint8Array([ 255, 127, 36, 0, 1, 254 ]);
            assert.deepEqual(el.value, new Uint8Array([ 255, 127, 36, 0, 1, 254 ]));
            assert.deepEqual(el.octetString, new Uint8Array([ 255, 127, 36, 0, 1, 254 ]));
        });

        it("encodes and decodes an OBJECT IDENTIFIER correctly", () => {
            const el = new CodecElement();
            el.objectIdentifier = asn1.ObjectIdentifier.fromParts([ 1, 3, 4, 6, 3665, 90 ]);
            assert.deepEqual(el.objectIdentifier, asn1.ObjectIdentifier.fromParts([ 1, 3, 4, 6, 3665, 90 ]));

            // iso(1) identified-organization(3) dod(6) internet(1) private(4) enterprise(1) 11591 4 11
            const el2 = new CodecElement();
            el2.objectIdentifier = asn1.ObjectIdentifier.fromParts([ 1, 3, 6, 1, 4, 1, 11591, 4, 11 ]);
            const oid = el2.objectIdentifier;
            assert.deepEqual(oid, asn1.ObjectIdentifier.fromParts([ 1, 3, 6, 1, 4, 1, 11591, 4, 11 ]));
            const el3 = new CodecElement();
            el3.objectIdentifier = oid;
            assert.deepEqual(el3.objectIdentifier, asn1.ObjectIdentifier.fromParts([ 1, 3, 6, 1, 4, 1, 11591, 4, 11 ]));
            assert.equal(el3.objectIdentifier.toString(), "1.3.6.1.4.1.11591.4.11");
            assert.deepEqual(asn1.ObjectIdentifier.fromString("1.3.6.1.4.1.11591.4.11"), oid);

            const sensitiveValues = [
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
                2147483647,
            ];

            for (let x = 0; x < 2; x++) {
                for (let y = 0; y < 40; y++) {
                    sensitiveValues.forEach((z) => {
                        el.objectIdentifier = asn1.ObjectIdentifier.fromParts([ x, y, 6, 4, z ]);
                        assert.deepEqual(el.objectIdentifier, asn1.ObjectIdentifier.fromParts([ x, y, 6, 4, z ]));
                        el.objectIdentifier = asn1.ObjectIdentifier.fromParts([ x, y, 6, 4, z, 0 ]);
                        assert.deepEqual(el.objectIdentifier, asn1.ObjectIdentifier.fromParts([ x, y, 6, 4, z, 0 ]));
                        el.objectIdentifier = asn1.ObjectIdentifier.fromParts([ x, y, 6, 4, z, 1 ]);
                        assert.deepEqual(el.objectIdentifier, asn1.ObjectIdentifier.fromParts([ x, y, 6, 4, z, 1 ]));
                    });
                }
            }

            for (let y = 0; y < 175; y++) {
                sensitiveValues.forEach((z) => {
                    el.objectIdentifier = asn1.ObjectIdentifier.fromParts([ 2, y, 6, 4, z ]);
                    assert.deepEqual(el.objectIdentifier, asn1.ObjectIdentifier.fromParts([ 2, y, 6, 4, z ]));
                    el.objectIdentifier = asn1.ObjectIdentifier.fromParts([ 2, y, 6, 4, z, 0 ]);
                    assert.deepEqual(el.objectIdentifier, asn1.ObjectIdentifier.fromParts([ 2, y, 6, 4, z, 0 ]));
                    el.objectIdentifier = asn1.ObjectIdentifier.fromParts([ 2, y, 6, 4, z, 1 ]);
                    assert.deepEqual(el.objectIdentifier, asn1.ObjectIdentifier.fromParts([ 2, y, 6, 4, z, 1 ]));
                });
            }
        });

        it("decodes an OBJECT IDENTIFIER with 0x80 in the middle of a number", () => {
            const el = new CodecElement();
            el.value = new Uint8Array([ 0x42, 0x81, 0x80, 0x06 ]);
            assert.equal(el.objectIdentifier.toString(), "1.26.16390");
        });

        it("encodes and decodes an ObjectDescriptor correctly", () => {
            const el = new CodecElement();
            el.objectDescriptor = "HENLO-BORTHERS";
            assert.equal(el.objectDescriptor, "HENLO-BORTHERS");
        });

        it("encodes and decodes a REAL correctly", () => {
            const el = new CodecElement();
            for (let i = -100; i < 100; i++) {
                // Alternating negative and positive floating point numbers exploring extreme values
                const num = Math.pow((i % 2 ? -1 : 1) * 1.23, i);
                el.real = num;
                assert(areFloatsEqual(el.real / num, 1.0));
            }

            const edgeCaseTests = [
                0.0,
                -0.0,
                (10.0 / 3.0), // Non-terminating decimal
                (-10.0 / 3.0), // Negative non-terminating decimal
                1.0,
                -1.0,
            ];

            edgeCaseTests.forEach((test) => {
                el.real = test;
                // Use absolute difference here rather than ratio, because you would otherwise divide by zero.
                assert(Math.abs(el.real - test) < floatingPointErrorTolerance);
            });

            el.real = Infinity;
            assert.equal(el.real, Infinity);

            el.real = -Infinity;
            assert.equal(el.real, -Infinity);

            el.real = NaN;
            assert.equal(el.real, NaN);

            // These tests might fail due to overflow
            el.real = Number.MAX_VALUE;
            assert(areFloatsEqual(el.real / Number.MAX_VALUE, 1.0));
            el.real = (Number.MIN_VALUE * 1e50);
            assert(areFloatsEqual(el.real / (Number.MIN_VALUE * 1e50), 1.0));

            el.real = (Number.MAX_SAFE_INTEGER + 1.0);
            assert(areFloatsEqual(el.real / (Number.MAX_SAFE_INTEGER + 1.0), 1.0));
            el.real = (Number.MIN_SAFE_INTEGER - 1.0);
            assert(areFloatsEqual(el.real / (Number.MIN_SAFE_INTEGER - 1.0), 1.0));

            const evenMoreEdgeCases = [
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
                1.2824271291,  // GLAISHER_KINKELIN_CONSTANT
            ];

            evenMoreEdgeCases.forEach((test) => {
                el.real = test;
                assert(areFloatsEqual(el.real / test, 1.0));
            });
        });

        it("encodes and decodes and ENUMERATED correctly", () => {
            const el = new CodecElement();
            for (let i = 0; i < 127; i++) {
                el.enumerated = i;
                assert.deepEqual(el.value, Buffer.from([ i ]));
                assert.equal(el.enumerated, i);
            }

            for (let i = -32768; i < 32767; i++) {
                el.enumerated = i;
                assert.equal(el.enumerated, i);
            }

            for (let i = -2147483647; i < 2147483647; i += 15485863) {
                el.enumerated = i;
                assert(el.enumerated == i); // Must be "==" because we are comparing a BigInt to a number.
            }
        });

        it("encodes and decodes a RELATIVE OID correctly", () => {
            const el = new CodecElement();
            const sensitiveValues = [
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
                2147483647,
            ];

            sensitiveValues.forEach((z) => {
                el.relativeObjectIdentifier = [ z, 2, 3 ];
                assert.deepEqual(el.relativeObjectIdentifier, [ z, 2, 3 ]);
                el.relativeObjectIdentifier = [ 1, z, 3 ];
                assert.deepEqual(el.relativeObjectIdentifier, [ 1, z, 3 ]);
                el.relativeObjectIdentifier = [ 1, 2, z ];
                assert.deepEqual(el.relativeObjectIdentifier, [ 1, 2, z ]);
            });
        });

        it("encodes and decodes a SEQUENCE correctly", () => {
            const el = new CodecElement();
            const subs = [];
            subs.push(new CodecElement());
            subs.push(new CodecElement());
            subs.push(new CodecElement());
            subs[0].tagNumber = 1;
            subs[0].boolean = true;
            subs[1].tagNumber = 2;
            subs[1].boolean = false;
            subs[2].tagNumber = 3;
            subs[2].boolean = true;
            el.sequence = subs;
            assert.deepEqual(el.value, Buffer.from([ 1, 1, 255, 2, 1, 0, 3, 1, 255 ]));
            const decodedElements = el.sequence;
            assert.equal(decodedElements.length, 3);
            assert.equal(decodedElements[0].boolean, true);
            assert.equal(decodedElements[1].boolean, false);
            assert.equal(decodedElements[2].boolean, true);
        });

        it("encodes and decodes a SET correctly", () => {
            const el = new CodecElement();
            const subs = [];
            subs.push(new CodecElement());
            subs.push(new CodecElement());
            subs.push(new CodecElement());
            subs[0].tagNumber = 1;
            subs[0].boolean = true;
            subs[1].tagNumber = 2;
            subs[1].boolean = false;
            subs[2].tagNumber = 3;
            subs[2].boolean = true;
            el.set = subs;
            assert.deepEqual(el.value, Buffer.from([ 1, 1, 255, 2, 1, 0, 3, 1, 255 ]));
            const decodedElements = el.set;
            assert.equal(decodedElements.length, 3);
            assert.equal(decodedElements[0].boolean, true);
            assert.equal(decodedElements[1].boolean, false);
            assert.equal(decodedElements[2].boolean, true);
        });

        it("encodes and decodes a NumericString correctly", () => {
            const el = new CodecElement();
            el.numericString = "12345 67890";
            assert.equal(el.numericString, "12345 67890");
        });

        it("encodes and decodes a PrintableString correctly", () => {
            const el = new CodecElement();
            el.printableString = "12345abcdef '()+,-./:=?";
            assert.equal(el.printableString, "12345abcdef '()+,-./:=?");
        });

        it("encodes and decodes a UTCTime correctly", () => {
            const el = new CodecElement();
            const test = new Date();
            el.utcTime = test;
            const ret = el.utcTime;
            /** NOTE:
             * You have to compare each member of the Date object individually,
             * because the methods do not read or write milliseconds.
             */
            assert.equal(ret.getUTCFullYear(), test.getUTCFullYear());
            assert.equal(ret.getUTCMonth(), test.getUTCMonth());
            assert.equal(ret.getUTCDate(), test.getUTCDate());
            assert.equal(ret.getUTCHours(), test.getUTCHours());
            assert.equal(ret.getUTCMinutes(), test.getUTCMinutes());
            assert.equal(ret.getUTCSeconds(), test.getUTCSeconds());

            el.utcTime = new Date(Date.UTC(2018, 11, 31, 22, 33, 44));
            assert.equal(el.utf8String, "181231223344Z");
        });

        it("encodes and decodes a GeneralizedTime correctly", () => {
            const el = new CodecElement();
            const test = new Date();
            el.generalizedTime = test;
            let ret = el.generalizedTime;
            /** NOTE:
             * You have to compare each member of the Date object individually,
             * because the methods do not read or write milliseconds.
             */
            assert.equal(ret.getUTCFullYear(), test.getUTCFullYear());
            assert.equal(ret.getUTCMonth(), test.getUTCMonth());
            assert.equal(ret.getUTCDate(), test.getUTCDate());
            assert.equal(ret.getUTCHours(), test.getUTCHours());
            assert.equal(ret.getUTCMinutes(), test.getUTCMinutes());
            assert.equal(ret.getUTCSeconds(), test.getUTCSeconds());

            el.generalizedTime = new Date(Date.UTC(2018, 11, 31, 22, 33, 44));
            assert.equal(el.utf8String, "20181231223344Z");

            el.utf8String = "20181211223344.06Z";
            ret = el.generalizedTime;
            assert.equal(ret.getUTCFullYear(), 2018);
            assert.equal(ret.getUTCMonth(), 11); // Month is 0-indexed.
            assert.equal(ret.getUTCDate(), 11);
            assert.equal(ret.getUTCHours(), 22);
            assert.equal(ret.getUTCMinutes(), 33);
            assert.equal(ret.getUTCSeconds(), 44);
        });

        it("encodes and decodes a BMPString correctly", () => {
            const el = new CodecElement();
            el.bmpString = "HENLOBORTHERS";
            assert.equal(el.bmpString, "HENLOBORTHERS");
        });

        it("encodes and decodes a GeneralString correctly", () => {
            const el = new CodecElement();
            el.generalString = "Testeroni";
            assert.equal(el.generalString, "Testeroni");
        });

        it("encodes and decodes a UniversalString correctly", () => {
            const el = new CodecElement();
            el.universalString = "HENLOBORTHERS";
            assert.equal(el.universalString, "HENLOBORTHERS");
        });
    });
});
