const asn1 = require("../../dist/node/index.js");

describe.each([
    [ "010203040506Z", "2001-02-03T04:05:06.000Z" ],
])("DER UTCTime decoding: %s should decode to %s", (gt, isot) => {
    test("should decode correctly", () => {
        const el = new asn1.DERElement();
        el.value = Buffer.from(gt);
        const g = el.utcTime;
        expect(g.toISOString()).toBe(isot);
    });
}, 5000);

describe.each([
    [ "21030303030303003030030030300303003003030303330033" ],
    [ "21150204Z" ],
    [ "21016204Z" ],
    [ "21020329Z" ],
    [ "2102032067Z" ],
    [ "210203205967Z" ],
    [ "21" ],
    [ "2102" ],
    [ "210203" ],
    [ "21020304.05.06" ],
    [ "21020304,05,06" ],
    [ "21020304,05,06" ],
    [ "21020320.25-0" ],
    [ "21020320.25+0" ],
    [ "21020320.25-081" ],
    [ "21020320.25+081" ],
    [ "21020320.25-08105" ],
    [ "21020320.25+08105" ],
    [ "21020320.25-0810Z" ],
    [ "21020320.25+0810Z" ],
    [ "0102030405Z" ],
    [ "0102030405-0400" ],
    [ "010203040506-0400" ],
    [ "0102030405+0400" ],
    [ "010203040506+0400" ],
    [ "0102030405-0415" ],
    [ "010203040506-0415" ],
    [ "0102030405+0415" ],
    [ "010203040506+0415" ],
])("DER UTCTime decoding: decoding %s should fail", (gt) => {
    test("should decode correctly", () => {
        const el = new asn1.DERElement();
        el.value = Buffer.from(gt);
        expect(() => el.utcTime).toThrow();
    });
}, 5000);
