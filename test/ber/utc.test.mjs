import * as asn1 from "../../dist/index.mjs";
import { test } from "node:test";
import { strict as assert } from "node:assert";

const validTests = [
    [ "0102030405Z", "2001-02-03T04:05:00.000Z" ],
    [ "010203040506Z", "2001-02-03T04:05:06.000Z" ],
    [ "0102030405-0400", "2001-02-03T08:05:00.000Z" ],
    [ "010203040506-0400", "2001-02-03T08:05:06.000Z" ],
    [ "0102030405+0400", "2001-02-03T00:05:00.000Z" ],
    [ "010203040506+0400", "2001-02-03T00:05:06.000Z" ],
    // Minute-specific timezone offsets
    [ "0102030405-0415", "2001-02-03T08:20:00.000Z" ],
    [ "010203040506-0415", "2001-02-03T08:20:06.000Z" ],
    [ "0102030405+0415", "2001-02-02T23:50:00.000Z" ],
    [ "010203040506+0415", "2001-02-02T23:50:06.000Z" ],
];

const invalidTests = [
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
];

for (const [ gt, isot ] of validTests) {
    test(gt + " should decode correctly as a UTCTime", () => {
        const el = new asn1.BERElement();
        el.value = Buffer.from(gt);
        const g = el.utcTime;
        assert.equal(g.toISOString(), isot);
    });
}

for (const gt of invalidTests) {
    test(gt + " should fail to decode as a UTCTime", () => {
        const el = new asn1.BERElement();
        el.value = Buffer.from(gt);
        assert.throws(() => el.utcTime.toISOString());
    });
}
