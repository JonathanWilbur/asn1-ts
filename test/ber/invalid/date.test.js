const asn1 = require("../../../dist/index.js");

describe("Basic Encoding Rules UTCTime decoder", () => {
    it("throws if a month greater than 12 is encountered", () => {
        const el = new asn1.BERElement();
        el.utf8String = "751308132656Z";
        expect(() => el.utcTime).toThrow();
    });

    it("throws if a day greater than 31 is encountered", () => {
        const el = new asn1.BERElement();
        el.utf8String = "751235132656Z";
        expect(() => el.utcTime).toThrow();
    });

    it("throws if a day greater than 30 is encountered on a 30-day month", () => {
        const el = new asn1.BERElement();
        el.utf8String = "751131132656Z";
        expect(() => el.utcTime).toThrow();
    });

    it("throws if a day greater than 29 is encountered on a February", () => {
        const el = new asn1.BERElement();
        el.utf8String = "750230132656Z";
        expect(() => el.utcTime).toThrow();
    });

    it("throws if an hour greater than 23 is encountered", () => {
        const el = new asn1.BERElement();
        el.utf8String = "751230272656Z";
        expect(() => el.utcTime).toThrow();
    });

    it("throws if a minute greater than 59 is encountered", () => {
        const el = new asn1.BERElement();
        el.utf8String = "751230219956Z";
        expect(() => el.utcTime).toThrow();
    });

    it("throws if a second greater than 59 is encountered", () => {
        const el = new asn1.BERElement();
        el.utf8String = "751230212699Z";
        expect(() => el.utcTime).toThrow();
    });
});

describe("Basic Encoding Rules GeneralizedTime decoder", () => {
    it("throws if a month greater than 12 is encountered", () => {
        const el = new asn1.BERElement();
        el.utf8String = "19751308132656Z";
        expect(() => el.generalizedTime).toThrow();
    });

    it("throws if a day greater than 31 is encountered", () => {
        const el = new asn1.BERElement();
        el.utf8String = "19751235132656Z";
        expect(() => el.generalizedTime).toThrow();
    });

    it("throws if a day greater than 30 is encountered on a 30-day month", () => {
        const el = new asn1.BERElement();
        el.utf8String = "19751131132656Z";
        expect(() => el.generalizedTime).toThrow();
    });

    it("throws if a day greater than 29 is encountered on a February", () => {
        const el = new asn1.BERElement();
        el.utf8String = "19750230132656Z";
        expect(() => el.generalizedTime).toThrow();
    });

    it("throws if an hour greater than 23 is encountered", () => {
        const el = new asn1.BERElement();
        el.utf8String = "19751230272656Z";
        expect(() => el.generalizedTime).toThrow();
    });

    it("throws if a minute greater than 59 is encountered", () => {
        const el = new asn1.BERElement();
        el.utf8String = "19751230219956Z";
        expect(() => el.generalizedTime).toThrow();
    });

    it("throws if a second greater than 59 is encountered", () => {
        const el = new asn1.BERElement();
        el.utf8String = "19751230212699Z";
        expect(() => el.generalizedTime).toThrow();
    });
});
