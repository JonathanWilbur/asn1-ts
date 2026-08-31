import * as asn1 from "../../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

describe("codec type guards", () => {
    it("recognizes same-copy BER, CER, DER, and X.690 elements", () => {
        const ber = new asn1.BERElement();
        const cer = new asn1.CERElement();
        const der = new asn1.DERElement();
        assert(asn1.X690Element.isX690(ber));
        assert(asn1.X690Element.isX690(cer));
        assert(asn1.X690Element.isX690(der));
        assert(asn1.BERElement.isBER(ber));
        assert(asn1.CERElement.isCER(cer));
        assert(asn1.DERElement.isDER(der));
        assert(asn1.ASN1Element.isElement(ber));
    });

    it("does not confuse BER, CER, and DER", () => {
        const ber = new asn1.BERElement();
        const cer = new asn1.CERElement();
        const der = new asn1.DERElement();
        assert(!asn1.BERElement.isBER(der));
        assert(!asn1.BERElement.isBER(cer));
        assert(!asn1.CERElement.isCER(der));
        assert(!asn1.CERElement.isCER(ber));
        assert(!asn1.DERElement.isDER(ber));
        assert(!asn1.DERElement.isDER(cer));
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
        assert(asn1.X690Element.isX690(standIn));
        assert(!asn1.BERElement.isBER(standIn));
        assert(!asn1.DERElement.isDER(standIn));
        assert(!(standIn instanceof asn1.X690Element));
    });

    it("recognizes branded codec objects from another copy", () => {
        const brandedBer = { [asn1.BER_ELEMENT_BRAND]: true };
        const brandedX690 = { [asn1.X690_ELEMENT_BRAND]: true };
        assert(asn1.BERElement.isBER(brandedBer));
        assert(asn1.X690Element.isX690(brandedX690));
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
        assert(asn1.External.isExternal(ext));
        assert(asn1.EmbeddedPDV.isEmbeddedPDV(pdv));
        assert(asn1.CharacterString.isCharacterString(cs));
        assert(!asn1.External.isExternal(pdv));
        assert(!asn1.EmbeddedPDV.isEmbeddedPDV(cs));
        assert(!asn1.CharacterString.isCharacterString(ext));
    });

    it("recognizes structural stand-ins from another copy", () => {
        const ext = { encoding: new Uint8Array(0), directReference: undefined };
        const pdv = { identification: ident, dataValue: new Uint8Array(0) };
        const cs = { identification: ident, stringValue: new Uint8Array(0) };
        assert(asn1.External.isExternal(ext));
        assert(asn1.EmbeddedPDV.isEmbeddedPDV(pdv));
        assert(asn1.CharacterString.isCharacterString(cs));
        assert(!asn1.EmbeddedPDV.isEmbeddedPDV(cs));
        assert(!asn1.CharacterString.isCharacterString(pdv));
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

        assert(asn1.YEAR_ENCODING.isYEAR_ENCODING(year));
        assert(asn1.YEAR_MONTH_ENCODING.isYEAR_MONTH_ENCODING(yearMonth));
        assert(asn1.DATE_ENCODING.isDATE_ENCODING(date));
        assert(asn1.HOURS_ENCODING.isHOURS_ENCODING(hours));
        assert(asn1.HOURS_DIFF_ENCODING.isHOURS_DIFF_ENCODING(hoursDiff));
        assert(asn1.HOURS_MINUTES_ENCODING.isHOURS_MINUTES_ENCODING(hoursMinutes));
        assert(asn1.HOURS_MINUTES_DIFF_ENCODING.isHOURS_MINUTES_DIFF_ENCODING(hoursMinutesDiff));
        assert(asn1.TIME_OF_DAY_ENCODING.isTIME_OF_DAY_ENCODING(tod));
        assert(asn1.TIME_OF_DAY_DIFF_ENCODING.isTIME_OF_DAY_DIFF_ENCODING(todDiff));
        assert(asn1.TIME_OF_DAY_FRACTION_ENCODING.isTIME_OF_DAY_FRACTION_ENCODING(todFrac));
        assert(asn1.TIME_OF_DAY_FRACTION_DIFF_ENCODING.isTIME_OF_DAY_FRACTION_DIFF_ENCODING(todFracDiff));
        assert(asn1.DURATION_EQUIVALENT.isDURATION_EQUIVALENT(duration));
        assert(asn1.DURATION_INTERVAL_ENCODING.isDURATION_INTERVAL_ENCODING(interval));

        assert(!asn1.YEAR_ENCODING.isYEAR_ENCODING(yearMonth));
        assert(!asn1.YEAR_MONTH_ENCODING.isYEAR_MONTH_ENCODING(date));
        assert(!asn1.DATE_ENCODING.isDATE_ENCODING(year));
        assert(!asn1.HOURS_ENCODING.isHOURS_ENCODING(hoursDiff));
        assert(!asn1.HOURS_DIFF_ENCODING.isHOURS_DIFF_ENCODING(hoursMinutesDiff));
        assert(!asn1.HOURS_MINUTES_ENCODING.isHOURS_MINUTES_ENCODING(tod));
        assert(!asn1.TIME_OF_DAY_ENCODING.isTIME_OF_DAY_ENCODING(todDiff));
        assert(!asn1.TIME_OF_DAY_FRACTION_ENCODING.isTIME_OF_DAY_FRACTION_ENCODING(todFracDiff));
        assert(!asn1.DURATION_EQUIVALENT.isDURATION_EQUIVALENT(interval));
        assert(!asn1.DURATION_INTERVAL_ENCODING.isDURATION_INTERVAL_ENCODING(duration));
    });

    it("recognizes structural stand-ins from another copy", () => {
        assert(asn1.DATE_ENCODING.isDATE_ENCODING({ year: 2020, month: 3, day: 7 }));
        assert(asn1.YEAR_ENCODING.isYEAR_ENCODING({ year: 2020 }));
        assert(asn1.HOURS_DIFF_ENCODING.isHOURS_DIFF_ENCODING({ hours: 15, minutes_diff: 0 }));
        assert(asn1.TIME_OF_DAY_FRACTION_ENCODING.isTIME_OF_DAY_FRACTION_ENCODING({
            hours: 15,
            minutes: 58,
            seconds: 23,
            fractional_part: 123,
        }));
        assert(!( { year: 2020, month: 3, day: 7 } instanceof asn1.DATE_ENCODING));
    });
});
