const asn1 = require("../../dist/node/index.js");

describe.each([
    [ "20210203040506Z", "2021-02-03T04:05:06.000Z" ],
    // With fractional seconds
    [ "20210203040506.3334Z", "2021-02-03T04:05:06.333Z" ],
])("DER GeneralizedTime decoding: %s should decode to %s", (gt, isot) => {
    test("should decode correctly", () => {
        const el = new asn1.DERElement();
        el.value = Buffer.from(gt);
        const g = el.generalizedTime;
        expect(g.toISOString()).toBe(isot);
    });
}, 5000);

describe.each([
    [ "2021030303030303003030030030300303003003030303330033" ],
    [ "2021150204Z" ],
    [ "2021016204Z" ],
    [ "2021020329Z" ],
    [ "202102032067Z" ],
    [ "20210203205967Z" ],
    [ "2021" ],
    [ "202102" ],
    [ "20210203" ],
    [ "2021020304.05.06" ],
    [ "2021020304,05,06" ],
    [ "2021020304,05,06" ],
    [ "2021020320.25-0" ],
    [ "2021020320.25+0" ],
    [ "2021020320.25-081" ],
    [ "2021020320.25+081" ],
    [ "2021020320.25-08105" ],
    [ "2021020320.25+08105" ],
    [ "2021020320.25-0810Z" ],
    [ "2021020320.25+0810Z" ],
    [ "2021020304Z" ],
    // With fractional hours
    [ "2021020304.3334Z" ],
    [ "2021020304,3334Z" ],
    [ "2021020304.50Z" ],
    [ "2021020304.333333334Z" ],
    // With fractional minutes
    [ "202102030405.3334Z" ],
    [ "202102030405,3334Z" ],
    [ "20210203040506,3334Z" ],
    // The most complicated examples
    [ "20210203040607.32895292-0503" ],
    [ "20210203040607,32895292+0304" ],
    // Simple timezone offset
    [ "20210203040000-05" ],
    [ "20210203040000-0500" ],
    // Time offset causes carry over into the next or previous day
    [ "2021020304+0800" ],
    [ "2021020320-0800" ],
    // Carry over, but with fractional hours this time
    [ "2021020304.25+0800" ],
    [ "2021020320.25-0800" ],
    // Carry over, but with offset minutes and fractional hours this time
    [ "2021020304.25+0815" ],
    [ "2021020320.25-0815" ],
    // Minutes with timezone offset
    [ "202102030406-0500" ],
    // Seconds with timezone offset
    [ "20210203040607-0500" ],
])("DER GeneralizedTime decoding: decoding %s should fail", (gt) => {
    test("should decode correctly", () => {
        const el = new asn1.DERElement();
        el.value = Buffer.from(gt);
        expect(() => el.generalizedTime).toThrow();
    });
}, 5000);
