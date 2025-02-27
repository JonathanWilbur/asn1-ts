import * as asn1 from "../../dist/index.mjs";
import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

const validTests = [
    // LOCAL TIME: This only works for me in Florida. This should be commented out.
    // [ "2021020304", "2021-02-03T09:00:00.000Z" ],
    // The (second) smallest and simplest time.
    [ "2021020304Z", "2021-02-03T04:00:00.000Z" ],
    // With fractional hours
    [ "2021020304.3334Z", "2021-02-03T04:20:00.000Z" ],
    [ "2021020304,3334Z", "2021-02-03T04:20:00.000Z" ],
    [ "2021020304.50Z", "2021-02-03T04:30:00.000Z" ],
    [ "2021020304.333333334Z", "2021-02-03T04:20:00.000Z" ],
    // With fractional minutes
    [ "202102030405.3334Z", "2021-02-03T04:05:20.000Z" ],
    [ "202102030405,3334Z", "2021-02-03T04:05:20.000Z" ],
    // With fractional seconds
    [ "20210203040506.3334Z", "2021-02-03T04:05:06.333Z" ],
    [ "20210203040506,3334Z", "2021-02-03T04:05:06.333Z" ],
    // Simple timezone offset
    [ "2021020304-05", "2021-02-03T09:00:00.000Z" ],
    [ "2021020304-0500", "2021-02-03T09:00:00.000Z" ],
    // Time offset causes carry over into the next or previous day
    [ "2021020304+0800", "2021-02-02T20:00:00.000Z" ],
    [ "2021020320-0800", "2021-02-04T04:00:00.000Z" ],
    // Carry over, but with fractional hours this time
    [ "2021020304.25+0800", "2021-02-02T20:15:00.000Z" ],
    [ "2021020320.25-0800", "2021-02-04T04:15:00.000Z" ],
    // Carry over, but with offset minutes and fractional hours this time
    [ "2021020304.25+0815", "2021-02-02T20:00:00.000Z" ],
    [ "2021020320.25-0815", "2021-02-04T04:30:00.000Z" ],
    // Minutes with timezone offset
    [ "202102030406-0500", "2021-02-03T09:06:00.000Z" ],
    // Seconds with timezone offset
    [ "20210203040607-0500", "2021-02-03T09:06:07.000Z" ],
    // The most complicated examples
    [ "20210203040607.32895292-0503", "2021-02-03T09:09:07.328Z" ],
    [ "20210203040607,32895292+0304", "2021-02-03T01:02:07.328Z" ],
];

const invalidTests = [
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
];

for (const [ gt, isot ] of validTests) {
    test(gt + " should decode correctly as a GeneralizedTime", () => {
        const el = new asn1.BERElement();
        el.value = Buffer.from(gt);
        const g = el.generalizedTime;
        assert.equal(g.toISOString(), isot);
    });
}

for (const gt of invalidTests) {
    test(gt + " should fail to decode as a GeneralizedTime", () => {
        const el = new asn1.BERElement();
        el.value = Buffer.from(gt);
        assert.throws(() => el.generalizedTime);
    });
}
