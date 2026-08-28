import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

describe("Canonical Encoding Rules", function () {
    it("encodes and decodes long BIT STRINGs correctly", () => {
        const longOddBits = new Array(4053);
        const longEvenBits = new Array(4000);

        const el = new asn1.CERElement();
        [
            longOddBits,
            longEvenBits,
        ].forEach((bits) => {
            for (let i = 0; i < bits.length; i++) {
                bits[i] = (i % 2);
            }

            el.bitString = new Uint8ClampedArray(bits);
            assert.deepEqual(el.bitString, new Uint8ClampedArray(bits));
        });
    });

    it("encodes and decodes long OCTET STRINGs correctly", () => {
        const longOddBytes = new Uint8Array(4053);
        const longEvenBytes = new Uint8Array(4000);

        const el = new asn1.CERElement();
        [
            longOddBytes,
            longEvenBytes,
        ].forEach((bytes) => {
            el.octetString = bytes;
            assert.deepEqual(el.octetString, Buffer.from(bytes));
        });
    });

    it("encodes and decodes long strings correctly", () => {
        // An odd length deliberately chosen so that it is not evenly
        // divisible by 1000.
        const longOddString = "1234567".repeat(453);

        // Intentionally evenly divisible by 1000.
        const longEvenString = "1234567890".repeat(400);

        const el = new asn1.CERElement();
        [
            longOddString,
            longEvenString,
        ].forEach((str) => {
            el.objectDescriptor = str;
            assert.equal(el.objectDescriptor, str);

            el.utf8String = str;
            assert.equal(el.utf8String, str);

            el.universalString = str;
            assert.equal(el.universalString, str);

            el.bmpString = str;
            assert.equal(el.bmpString, str);
        });
    });

    describe("constructed BIT STRING", () => {
        function bits (length) {
            const ret = new Uint8ClampedArray(length);
            for (let i = 0; i < length; i++) {
                ret[i] = (i % 2);
            }
            return ret;
        }

        function primitiveBitStringTLV (contents) {
            const tlv = [ 0x03 ];
            if (contents.length < 128) {
                tlv.push(contents.length);
            } else {
                tlv.push(0x82, (contents.length >> 8) & 0xFF, contents.length & 0xFF);
            }
            for (let i = 0; i < contents.length; i++) {
                tlv.push(contents[i]);
            }
            return tlv;
        }

        it("encodes BIT STRINGs of 1000 or fewer contents octets as primitive", () => {
            const el = new asn1.CERElement();
            el.bitString = bits(7992); // 999 data octets + unused-bits octet = 1000
            assert.equal(el.construction, asn1.ASN1Construction.primitive);
            assert.deepEqual(el.bitString, bits(7992));
        });

        it("encodes BIT STRINGs of more than 1000 contents octets as constructed primitive fragments", () => {
            const value = bits(7993); // 1000 data octets + unused-bits octet = 1001
            const el = new asn1.CERElement();
            el.bitString = value;
            assert.equal(el.construction, asn1.ASN1Construction.constructed);
            const fragments = el.sequence;
            assert.equal(fragments.length, 2);
            assert.equal(fragments[0].construction, asn1.ASN1Construction.primitive);
            assert.equal(fragments[0].tagNumber, asn1.ASN1UniversalType.bitString);
            assert.equal(fragments[0].value.length, 1000);
            assert.equal(fragments[0].value[0], 0x00);
            assert.equal(fragments[1].construction, asn1.ASN1Construction.primitive);
            assert.ok(fragments[1].value.length >= 1 && fragments[1].value.length <= 1000);
            assert.deepEqual(el.bitString, value);
        });

        it("round-trips a constructed BIT STRING whose last fragment has unused bits", () => {
            const value = bits(8005);
            const el = new asn1.CERElement();
            el.bitString = value;
            assert.equal(el.construction, asn1.ASN1Construction.constructed);
            assert.deepEqual(el.bitString, value);
        });

        it("deconstructs to a single primitive encoding whose unused-bits octet comes from the last fragment", () => {
            const first = new Uint8Array(1000);
            first[0] = 0x00;
            first[999] = 0x0F;
            const last = new Uint8Array([ 0x05, 0xE0 ]);
            const data = new Uint8Array([
                0x23, 0x80,
                ...primitiveBitStringTLV(first),
                ...primitiveBitStringTLV(last),
                0x00, 0x00,
            ]);
            const element = new asn1.CERElement();
            element.fromBytes(data);
            assert.deepEqual(
                element.deconstruct("BIT STRING", asn1.ASN1UniversalType.bitString),
                Buffer.concat([ Buffer.from([ 0x05 ]), first.subarray(1), last.subarray(1) ]),
            );
            assert.deepEqual(element.bitString.subarray(element.bitString.length - 3), new Uint8ClampedArray([ 1, 1, 1 ]));
        });

        it("throws when a non-last fragment does not have 1000 contents octets", () => {
            const data = new Uint8Array([
                0x23, 0x80,
                0x03, 0x02, 0x00, 0x0F,
                0x03, 0x02, 0x05, 0xF0,
                0x00, 0x00,
            ]);
            const element = new asn1.CERElement();
            element.fromBytes(data);
            assert.throws(() => element.bitString);
        });

        it("throws when a non-last fragment has unused bits", () => {
            const first = new Uint8Array(1000);
            first[0] = 0x03;
            const data = new Uint8Array([
                0x23, 0x80,
                ...primitiveBitStringTLV(first),
                ...primitiveBitStringTLV(new Uint8Array([ 0x00, 0x0F ])),
                0x00, 0x00,
            ]);
            const element = new asn1.CERElement();
            element.fromBytes(data);
            assert.throws(() => element.bitString);
        });

        it("throws when a constructed fragment is itself constructed", () => {
            const nested = [
                0x23, 0x80,
                0x03, 0x02, 0x00, 0x0F,
                0x00, 0x00,
            ];
            const data = new Uint8Array([
                0x23, 0x80,
                ...nested,
                ...primitiveBitStringTLV(new Uint8Array([ 0x00, 0x0F ])),
                0x00, 0x00,
            ]);
            const element = new asn1.CERElement();
            element.fromBytes(data);
            assert.throws(() => element.bitString);
        });

        it("throws when a constructed BIT STRING contains a child of the wrong tag number", () => {
            const first = new Uint8Array(1000);
            const data = new Uint8Array([
                0x23, 0x80,
                0x04, 0x82, 0x03, 0xE8, ...first, // OCTET STRING of 1000 octets
                0x03, 0x02, 0x00, 0x0F,
                0x00, 0x00,
            ]);
            const element = new asn1.CERElement();
            element.fromBytes(data);
            assert.throws(() => element.bitString);
        });
    });
});
