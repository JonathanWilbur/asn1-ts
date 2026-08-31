import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

describe("codec type guards", () => {
    it("recognizes same-copy BER, CER, DER, and X.690 elements", () => {
        const ber = new asn1.BERElement();
        const cer = new asn1.CERElement();
        const der = new asn1.DERElement();
        assert(asn1.X690Element.isElement(ber));
        assert(asn1.X690Element.isElement(cer));
        assert(asn1.X690Element.isElement(der));
        assert(asn1.BERElement.isElement(ber));
        assert(asn1.CERElement.isElement(cer));
        assert(asn1.DERElement.isElement(der));
        assert(asn1.ASN1Element.isElement(ber));
    });

    it("does not confuse BER, CER, and DER", () => {
        const ber = new asn1.BERElement();
        const cer = new asn1.CERElement();
        const der = new asn1.DERElement();
        assert(!asn1.BERElement.isElement(der));
        assert(!asn1.BERElement.isElement(cer));
        assert(!asn1.CERElement.isElement(der));
        assert(!asn1.CERElement.isElement(ber));
        assert(!asn1.DERElement.isElement(ber));
        assert(!asn1.DERElement.isElement(cer));
    });

    it("recognizes an unbranded X.690 stand-in via sequenceElements", () => {
        const standIn = {
            tagClass: 0,
            tagNumber: 2,
            construction: 0,
            toBytes () {
                return new Uint8Array(0);
            },
            sequenceElements () {
                return [];
            },
        };
        assert(asn1.X690Element.isElement(standIn));
        assert(!asn1.BERElement.isElement(standIn));
        assert(!asn1.DERElement.isElement(standIn));
        assert(!(standIn instanceof asn1.X690Element));
    });

    it("recognizes branded codec objects from another copy", () => {
        const brandedBer = { [asn1.BERElement.brand]: true };
        const brandedX690 = { [asn1.X690Element.brand]: true };
        assert(asn1.BERElement.isElement(brandedBer));
        assert(asn1.X690Element.isElement(brandedX690));
        assert(!(brandedBer instanceof asn1.BERElement));
    });
});

describe("External, EmbeddedPDV, and CharacterString type guards", () => {
    const ident = new asn1.DERElement();
    ident.objectIdentifier = asn1.ObjectIdentifier.fromParts([ 1, 2, 840 ]);

    it("recognizes same-copy instances", () => {
        const ext = new asn1.External(
            asn1.ObjectIdentifier.fromParts([ 2, 5, 4, 3 ]),
            undefined,
            undefined,
            new Uint8Array([ 1, 2, 3 ]),
        );
        const pdv = new asn1.EmbeddedPDV(ident, new Uint8Array([ 4, 5 ]));
        const cs = new asn1.CharacterString(ident, new Uint8Array([ 6, 7 ]));
        assert(asn1.External.isClassOf(ext));
        assert(asn1.EmbeddedPDV.isClassOf(pdv));
        assert(asn1.CharacterString.isClassOf(cs));
        assert(!asn1.External.isClassOf(pdv));
        assert(!asn1.EmbeddedPDV.isClassOf(cs));
        assert(!asn1.CharacterString.isClassOf(ext));
    });

    it("recognizes structural stand-ins from another copy", () => {
        const ext = { encoding: new Uint8Array(0), directReference: undefined };
        const pdv = { identification: ident, dataValue: new Uint8Array(0) };
        const cs = { identification: ident, stringValue: new Uint8Array(0) };
        assert(asn1.External.isClassOf(ext));
        assert(asn1.EmbeddedPDV.isClassOf(pdv));
        assert(asn1.CharacterString.isClassOf(cs));
        assert(!asn1.EmbeddedPDV.isClassOf(cs));
        assert(!asn1.CharacterString.isClassOf(pdv));
        assert(!(ext instanceof asn1.External));
    });
});

describe("X.696 time type guards", () => {
    it("recognizes same-copy instances and not sibling encodings", () => {
        const year = new asn1.YEAR_ENCODING(2020);
        const yearMonth = new asn1.YEAR_MONTH_ENCODING(2020, 3);
        const date = new asn1.DATE_ENCODING(2020, 3, 7);
        const hours = new asn1.HOURS_ENCODING(15);
        const hoursDiff = new asn1.HOURS_DIFF_ENCODING(15, 300);
        const hoursMinutes = new asn1.HOURS_MINUTES_ENCODING(15, 58);
        const hoursMinutesDiff = new asn1.HOURS_MINUTES_DIFF_ENCODING(15, 58, 300);
        const tod = new asn1.TIME_OF_DAY_ENCODING(15, 58, 23);
        const todDiff = new asn1.TIME_OF_DAY_DIFF_ENCODING(15, 58, 23, 300);
        const todFrac = new asn1.TIME_OF_DAY_FRACTION_ENCODING(15, 58, 23, 123);
        const todFracDiff = new asn1.TIME_OF_DAY_FRACTION_DIFF_ENCODING(15, 58, 23, 123, 300);
        const duration = new asn1.DURATION_EQUIVALENT(1);
        const interval = new asn1.DURATION_INTERVAL_ENCODING(1);

        assert(asn1.YEAR_ENCODING.isClassOf(year));
        assert(asn1.YEAR_MONTH_ENCODING.isClassOf(yearMonth));
        assert(asn1.DATE_ENCODING.isClassOf(date));
        assert(asn1.HOURS_ENCODING.isClassOf(hours));
        assert(asn1.HOURS_DIFF_ENCODING.isClassOf(hoursDiff));
        assert(asn1.HOURS_MINUTES_ENCODING.isClassOf(hoursMinutes));
        assert(asn1.HOURS_MINUTES_DIFF_ENCODING.isClassOf(hoursMinutesDiff));
        assert(asn1.TIME_OF_DAY_ENCODING.isClassOf(tod));
        assert(asn1.TIME_OF_DAY_DIFF_ENCODING.isClassOf(todDiff));
        assert(asn1.TIME_OF_DAY_FRACTION_ENCODING.isClassOf(todFrac));
        assert(asn1.TIME_OF_DAY_FRACTION_DIFF_ENCODING.isClassOf(todFracDiff));
        assert(asn1.DURATION_EQUIVALENT.isClassOf(duration));
        assert(asn1.DURATION_INTERVAL_ENCODING.isClassOf(interval));

        assert(!asn1.YEAR_ENCODING.isClassOf(yearMonth));
        assert(!asn1.YEAR_MONTH_ENCODING.isClassOf(date));
        assert(!asn1.DATE_ENCODING.isClassOf(year));
        assert(!asn1.HOURS_ENCODING.isClassOf(hoursDiff));
        assert(!asn1.HOURS_DIFF_ENCODING.isClassOf(hoursMinutesDiff));
        assert(!asn1.HOURS_MINUTES_ENCODING.isClassOf(tod));
        assert(!asn1.TIME_OF_DAY_ENCODING.isClassOf(todDiff));
        assert(!asn1.TIME_OF_DAY_FRACTION_ENCODING.isClassOf(todFracDiff));
        assert(!asn1.DURATION_EQUIVALENT.isClassOf(interval));
        assert(!asn1.DURATION_INTERVAL_ENCODING.isClassOf(duration));
    });

    it("recognizes structural stand-ins from another copy", () => {
        assert(asn1.DATE_ENCODING.isClassOf({ year: 2020, month: 3, day: 7 }));
        assert(asn1.YEAR_ENCODING.isClassOf({ year: 2020 }));
        assert(asn1.HOURS_DIFF_ENCODING.isClassOf({ hours: 15, minutes_diff: 0 }));
        assert(asn1.TIME_OF_DAY_FRACTION_ENCODING.isClassOf({
            hours: 15,
            minutes: 58,
            seconds: 23,
            fractional_part: 123,
        }));
        assert(!( { year: 2020, month: 3, day: 7 } instanceof asn1.DATE_ENCODING));
    });

    it("does not treat an unbranded duration-shaped object as either duration class", () => {
        const standIn = {
            years: 1,
            months: undefined,
            weeks: undefined,
            days: undefined,
            hours: undefined,
            minutes: undefined,
            seconds: undefined,
            toISOString () {
                return "P1Y";
            },
        };
        assert(!asn1.DURATION_EQUIVALENT.isClassOf(standIn));
        assert(!asn1.DURATION_INTERVAL_ENCODING.isClassOf(standIn));
        assert(asn1.DURATION_EQUIVALENT.isClassOf({ [asn1.DURATION_EQUIVALENT.brand]: true }));
        assert(asn1.DURATION_INTERVAL_ENCODING.isClassOf({
            [asn1.DURATION_INTERVAL_ENCODING.brand]: true,
        }));
    });
});
