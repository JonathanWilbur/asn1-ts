import * as asn1 from "../dist/index.mjs";
const CodecElement = asn1.DERElement;
import { strict as assert } from "node:assert";

const sensitiveValues = [
    0,
    1,
    2,
    3,
    7,
    8,
    126,
    127,
    128,
    254,
    255,
    256,
    32766,
    32767,
    32768,
    65534,
    65535,
    65536,
    // 2147483646,
    // 2147483647,
];

console.time("oids");
let i = 0;
while (i < 100) {
    i++;
    const el = new CodecElement();
    el.objectIdentifier = asn1.ObjectIdentifier.fromParts([ 1, 3, 4, 6, 65, 90 ]);
    const oid = el.objectIdentifier;
    assert(oid.isEqualTo(asn1.ObjectIdentifier.fromParts([ 1, 3, 4, 6, 65, 90 ])));

    for (let x = 0; x < 2; x++) {
        for (let y = 0; y < 40; y++) {
            sensitiveValues.forEach((z) => {
                // console.log(x, y, z);
                el.objectIdentifier = asn1.ObjectIdentifier.fromParts([ x, y, 6, 4, z ]);
                assert((el.objectIdentifier).isEqualTo(asn1.ObjectIdentifier.fromParts([ x, y, 6, 4, z ])));
                el.objectIdentifier = asn1.ObjectIdentifier.fromParts([ x, y, 6, 4, z, 0 ]);
                assert(el.objectIdentifier.isEqualTo(asn1.ObjectIdentifier.fromParts([ x, y, 6, 4, z, 0 ])));
                el.objectIdentifier = asn1.ObjectIdentifier.fromParts([ x, y, 6, 4, z, 1 ]);
                assert(el.objectIdentifier.isEqualTo(asn1.ObjectIdentifier.fromParts([ x, y, 6, 4, z, 1 ])));
            });
        }
    }

    for (let y = 0; y < 175; y++) {
        sensitiveValues.forEach((z) => {
            el.objectIdentifier = asn1.ObjectIdentifier.fromParts([ 2, y, 6, 4, z ]);
            assert((el.objectIdentifier).isEqualTo(asn1.ObjectIdentifier.fromParts([ 2, y, 6, 4, z ])));
            el.objectIdentifier = asn1.ObjectIdentifier.fromParts([ 2, y, 6, 4, z, 0 ]);
            assert(el.objectIdentifier.isEqualTo(asn1.ObjectIdentifier.fromParts([ 2, y, 6, 4, z, 0 ])));
            el.objectIdentifier = asn1.ObjectIdentifier.fromParts([ 2, y, 6, 4, z, 1 ]);
            assert(el.objectIdentifier.isEqualTo(asn1.ObjectIdentifier.fromParts([ 2, y, 6, 4, z, 1 ])));
        });
    }
}
console.timeEnd("oids");

console.time("oids_to_string");
i = 0;
while (i < 100) {
    i++;
    const el = new CodecElement();
    el.objectIdentifier = asn1.ObjectIdentifier.fromParts([ 1, 3, 4, 6, 65, 90 ]);
    el.objectIdentifier.toString();

    for (let x = 0; x < 2; x++) {
        for (let y = 0; y < 40; y++) {
            sensitiveValues.forEach((z) => {
                // console.log(x, y, z);
                el.objectIdentifier = asn1.ObjectIdentifier.fromParts([ x, y, 6, 4, z ]);
                asn1.ObjectIdentifier.fromString(el.objectIdentifier.toString());
                el.objectIdentifier = asn1.ObjectIdentifier.fromParts([ x, y, 6, 4, z, 0 ]);
                asn1.ObjectIdentifier.fromString(el.objectIdentifier.toString());
                el.objectIdentifier = asn1.ObjectIdentifier.fromParts([ x, y, 6, 4, z, 1 ]);
                asn1.ObjectIdentifier.fromString(el.objectIdentifier.toString());
            });
        }
    }

    for (let y = 0; y < 175; y++) {
        sensitiveValues.forEach((z) => {
            el.objectIdentifier = asn1.ObjectIdentifier.fromParts([ 2, y, 6, 4, z ]);
            asn1.ObjectIdentifier.fromString(el.objectIdentifier.toString());
            el.objectIdentifier = asn1.ObjectIdentifier.fromParts([ 2, y, 6, 4, z, 0 ]);
            asn1.ObjectIdentifier.fromString(el.objectIdentifier.toString());
            el.objectIdentifier = asn1.ObjectIdentifier.fromParts([ 2, y, 6, 4, z, 1 ]);
            asn1.ObjectIdentifier.fromString(el.objectIdentifier.toString());
        });
    }
}
console.timeEnd("oids_to_string");
