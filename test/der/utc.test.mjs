import * as asn1 from "../../dist/index.mjs";
import { test } from "node:test";
import { strict as assert } from "node:assert";

const validTests = [
    [ "010203040506Z", "2001-02-03T04:05:06.000Z" ],
];

const invalidTest = [
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
];

for (const [ gt, isot ] of validTests) {
    test("DER-encoded UTCTime " + gt + " should decode correctly", () => {
        const el = new asn1.DERElement();
        el.value = Buffer.from(gt);
        const g = el.utcTime;
        assert.equal(g.toISOString(), isot);
    });
}

for (const [ gt ] of invalidTest) {
    test("DER-encoded UTCTime " + gt + " should fail to decode by throwing", () => {
        const el = new asn1.DERElement();
        el.value = Buffer.from(gt);
        assert.throws(() => el.utcTime);
    });
}
