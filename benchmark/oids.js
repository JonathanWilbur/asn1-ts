const asn1 = require("../dist/node/index.js");
const CodecElement = asn1.DERElement;
const { strict: assert } = require("node:assert");





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
    el.objectIdentifier = new asn1.ObjectIdentifier([ 1, 3, 4, 6, 3665, 90 ]);
    const oid = el.objectIdentifier;
    assert(oid.isEqualTo(new asn1.ObjectIdentifier([ 1, 3, 4, 6, 3665, 90 ])));

    for (let x = 0; x < 2; x++) {
        for (let y = 0; y < 40; y++) {
            sensitiveValues.forEach((z) => {
                // console.log(x, y, z);
                el.objectIdentifier = new asn1.ObjectIdentifier([ x, y, 6, 4, z ]);
                assert((el.objectIdentifier).isEqualTo(new asn1.ObjectIdentifier([ x, y, 6, 4, z ])));
                el.objectIdentifier = new asn1.ObjectIdentifier([ x, y, 6, 4, z, 0 ]);
                assert(el.objectIdentifier.isEqualTo(new asn1.ObjectIdentifier([ x, y, 6, 4, z, 0 ])));
                el.objectIdentifier = new asn1.ObjectIdentifier([ x, y, 6, 4, z, 1 ]);
                assert(el.objectIdentifier.isEqualTo(new asn1.ObjectIdentifier([ x, y, 6, 4, z, 1 ])));
            });
        }
    }

    for (let y = 0; y < 175; y++) {
        sensitiveValues.forEach((z) => {
            el.objectIdentifier = new asn1.ObjectIdentifier([ 2, y, 6, 4, z ]);
            assert((el.objectIdentifier).isEqualTo(new asn1.ObjectIdentifier([ 2, y, 6, 4, z ])));
            el.objectIdentifier = new asn1.ObjectIdentifier([ 2, y, 6, 4, z, 0 ]);
            assert(el.objectIdentifier.isEqualTo(new asn1.ObjectIdentifier([ 2, y, 6, 4, z, 0 ])));
            el.objectIdentifier = new asn1.ObjectIdentifier([ 2, y, 6, 4, z, 1 ]);
            assert(el.objectIdentifier.isEqualTo(new asn1.ObjectIdentifier([ 2, y, 6, 4, z, 1 ])));
        });
    }
}
console.timeEnd("oids");


console.time("oids_to_string");
i = 0;
while (i < 100) {
    i++;
    const el = new CodecElement();
    el.objectIdentifier = new asn1.ObjectIdentifier([ 1, 3, 4, 6, 3665, 90 ]);
    el.objectIdentifier.toString();

    for (let x = 0; x < 2; x++) {
        for (let y = 0; y < 40; y++) {
            sensitiveValues.forEach((z) => {
                // console.log(x, y, z);
                el.objectIdentifier = new asn1.ObjectIdentifier([ x, y, 6, 4, z ]);
                asn1.ObjectIdentifier.fromString(el.objectIdentifier.toString());
                el.objectIdentifier = new asn1.ObjectIdentifier([ x, y, 6, 4, z, 0 ]);
                asn1.ObjectIdentifier.fromString(el.objectIdentifier.toString());
                el.objectIdentifier = new asn1.ObjectIdentifier([ x, y, 6, 4, z, 1 ]);
                asn1.ObjectIdentifier.fromString(el.objectIdentifier.toString());
            });
        }
    }

    for (let y = 0; y < 175; y++) {
        sensitiveValues.forEach((z) => {
            el.objectIdentifier = new asn1.ObjectIdentifier([ 2, y, 6, 4, z ]);
            asn1.ObjectIdentifier.fromString(el.objectIdentifier.toString());
            el.objectIdentifier = new asn1.ObjectIdentifier([ 2, y, 6, 4, z, 0 ]);
            asn1.ObjectIdentifier.fromString(el.objectIdentifier.toString());
            el.objectIdentifier = new asn1.ObjectIdentifier([ 2, y, 6, 4, z, 1 ]);
            asn1.ObjectIdentifier.fromString(el.objectIdentifier.toString());
        });
    }
}
console.timeEnd("oids_to_string");
