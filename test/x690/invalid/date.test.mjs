import * as asn1 from "../../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

[
    asn1.BERElement,
    asn1.CERElement,
    asn1.DERElement,
].forEach((CodecElement) => {
    describe(`${CodecElement.constructor.name} UTCTime decoder`, () => {
        it("throws if a month greater than 12 is encountered", () => {
            const el = new CodecElement();
            el.utf8String = "751308132656Z";
            assert.throws(() => el.utcTime);
        });

        it("throws if a day greater than 31 is encountered", () => {
            const el = new CodecElement();
            el.utf8String = "751235132656Z";
            assert.throws(() => el.utcTime);
        });

        it("throws if a day greater than 30 is encountered on a 30-day month", () => {
            const el = new CodecElement();
            el.utf8String = "751131132656Z";
            assert.throws(() => el.utcTime);
        });

        it("throws if a day greater than 29 is encountered on a February", () => {
            const el = new CodecElement();
            el.utf8String = "750230132656Z";
            assert.throws(() => el.utcTime);
        });

        it("throws if an hour greater than 23 is encountered", () => {
            const el = new CodecElement();
            el.utf8String = "751230272656Z";
            assert.throws(() => el.utcTime);
        });

        it("throws if a minute greater than 59 is encountered", () => {
            const el = new CodecElement();
            el.utf8String = "751230219956Z";
            assert.throws(() => el.utcTime);
        });

        it("throws if a second greater than 59 is encountered", () => {
            const el = new CodecElement();
            el.utf8String = "751230212699Z";
            assert.throws(() => el.utcTime);
        });
    });

    describe(`${CodecElement.constructor.name} GeneralizedTime decoder`, () => {
        it("throws if a month greater than 12 is encountered", () => {
            const el = new CodecElement();
            el.utf8String = "19751308132656Z";
            assert.throws(() => el.generalizedTime);
        });

        it("throws if a day greater than 31 is encountered", () => {
            const el = new CodecElement();
            el.utf8String = "19751235132656Z";
            assert.throws(() => el.generalizedTime);
        });

        it("throws if a day greater than 30 is encountered on a 30-day month", () => {
            const el = new CodecElement();
            el.utf8String = "19751131132656Z";
            assert.throws(() => el.generalizedTime);
        });

        it("throws if a day greater than 29 is encountered on a February", () => {
            const el = new CodecElement();
            el.utf8String = "19750230132656Z";
            assert.throws(() => el.generalizedTime);
        });

        it("throws if an hour greater than 23 is encountered", () => {
            const el = new CodecElement();
            el.utf8String = "19751230272656Z";
            assert.throws(() => el.generalizedTime);
        });

        it("throws if a minute greater than 59 is encountered", () => {
            const el = new CodecElement();
            el.utf8String = "19751230219956Z";
            assert.throws(() => el.generalizedTime);
        });

        it("throws if a second greater than 59 is encountered", () => {
            const el = new CodecElement();
            el.utf8String = "19751230212699Z";
            assert.throws(() => el.generalizedTime);
        });
    });
});
