import * as asn1 from "../dist/index.mjs";
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

function nestSequences (depth) {
    let inner = new asn1.BERElement();
    inner.integer = 1;
    inner.tagNumber = asn1.ASN1UniversalType.integer;
    for (let i = 0; i < depth; i++) {
        inner = asn1.BERElement.fromSequence([ inner ]);
    }
    return inner;
}

function nestExternals (depth) {
    let inner = new asn1.BERElement();
    inner.integer = 1;
    inner.tagNumber = asn1.ASN1UniversalType.integer;
    for (let i = 0; i < depth; i++) {
        const wrap = new asn1.BERElement();
        wrap.external = new asn1.External(undefined, 1, undefined, inner);
        wrap.tagNumber = asn1.ASN1UniversalType.external;
        inner = wrap;
    }
    return inner;
}

describe("ASN1Element.toString recursion", () => {
    it("truncates deeply nested UNIVERSAL SEQUENCE", () => {
        const el = nestSequences(120);
        const str = el.toString();
        assert.equal(str.includes("[...]"), true);
    });

    it("does not throw on deeply nested UNIVERSAL SEQUENCE toJSON", () => {
        const el = nestSequences(120);
        assert.doesNotThrow(() => el.toJSON());
    });

    it("truncates deeply nested EXTERNAL single-ASN1-type values", () => {
        const el = nestExternals(120);
        const str = el.toString();
        assert.equal(str.includes("[...]"), true);
        assert.doesNotThrow(() => el.toJSON());
    });
});

describe("EXTERNAL toString", () => {
    it("prints single-ASN1-type value notation", () => {
        const inner = new asn1.DERElement();
        inner.integer = 5;
        inner.tagNumber = asn1.ASN1UniversalType.integer;
        const ext = new asn1.External(
            asn1.ObjectIdentifier.fromParts([ 2, 5, 4, 3 ]),
            1,
            "commonName",
            inner,
        );
        assert.equal(
            ext.toString(),
            'EXTERNAL { direct-reference { 2 5 4 3 } , indirect-reference 1 , data-value-descriptor "commonName" , encoding single-ASN1-type : 5 }',
        );
        const el = new asn1.DERElement();
        el.external = ext;
        el.tagNumber = asn1.ASN1UniversalType.external;
        assert.equal(el.toString(), ext.toString());
    });

    it("prints octet-aligned and arbitrary encodings", () => {
        const oid = asn1.ObjectIdentifier.fromParts([ 1, 2, 840 ]);
        const octets = new asn1.External(oid, undefined, undefined, new Uint8Array([ 0x0a, 0x0b ]));
        assert.equal(
            octets.toString(),
            "EXTERNAL { direct-reference { 1 2 840 } , encoding octet-aligned : '0a0b'H }",
        );
        const bits = new asn1.External(
            undefined,
            1,
            undefined,
            new Uint8ClampedArray([ 1, 0, 1, 1 ]),
        );
        assert.equal(
            bits.toString(),
            "EXTERNAL { indirect-reference 1 , encoding arbitrary : '1011'B }",
        );
    });

    it("includes an indirect-reference of zero", () => {
        const inner = new asn1.DERElement();
        inner.boolean = true;
        inner.tagNumber = asn1.ASN1UniversalType.boolean;
        const ext = new asn1.External(undefined, 0, undefined, inner);
        assert.equal(
            ext.toString(),
            "EXTERNAL { indirect-reference 0 , encoding single-ASN1-type : TRUE }",
        );
    });
});

describe("EMBEDDED PDV toString", () => {
    it("prints the syntax identification alternative", () => {
        const ident = new asn1.BERElement();
        ident.tagClass = asn1.ASN1TagClass.context;
        ident.construction = asn1.ASN1Construction.primitive;
        ident.tagNumber = 1;
        ident.objectIdentifier = asn1.ObjectIdentifier.fromParts([ 1, 2, 840 ]);
        const pdv = new asn1.EmbeddedPDV(ident, new Uint8Array([ 0xab, 0xcd ]));
        assert.equal(
            pdv.toString(),
            "EMBEDDED PDV { identification syntax : { 1 2 840 } , data-value 'abcd'H }",
        );
        const el = new asn1.BERElement();
        el.embeddedPDV = pdv;
        el.tagNumber = asn1.ASN1UniversalType.embeddedPDV;
        assert.equal(el.toString(), pdv.toString());
    });

    it("prints the syntaxes, transfer-syntax, and fixed alternatives", () => {
        const abstractOid = new asn1.BERElement();
        abstractOid.objectIdentifier = asn1.ObjectIdentifier.fromParts([ 1, 2, 3 ]);
        abstractOid.tagNumber = asn1.ASN1UniversalType.objectIdentifier;
        const transferOid = new asn1.BERElement();
        transferOid.objectIdentifier = asn1.ObjectIdentifier.fromParts([ 2, 1, 1 ]);
        transferOid.tagNumber = asn1.ASN1UniversalType.objectIdentifier;
        const syntaxes = asn1.BERElement.fromSequence([ abstractOid, transferOid ]);
        syntaxes.tagClass = asn1.ASN1TagClass.context;
        syntaxes.tagNumber = 0;
        assert.equal(
            new asn1.EmbeddedPDV(syntaxes, new Uint8Array(0)).toString(),
            "EMBEDDED PDV { identification syntaxes : { abstract { 1 2 3 } , transfer { 2 1 1 } } , data-value ''H }",
        );

        const xfer = new asn1.BERElement();
        xfer.tagClass = asn1.ASN1TagClass.context;
        xfer.construction = asn1.ASN1Construction.primitive;
        xfer.tagNumber = 4;
        xfer.objectIdentifier = asn1.ObjectIdentifier.fromParts([ 2, 1 ]);
        assert.equal(
            new asn1.EmbeddedPDV(xfer, new Uint8Array([ 0xff ])).toString(),
            "EMBEDDED PDV { identification transfer-syntax : { 2 1 } , data-value 'ff'H }",
        );

        const fixed = new asn1.BERElement();
        fixed.tagClass = asn1.ASN1TagClass.context;
        fixed.tagNumber = 5;
        assert.equal(
            new asn1.EmbeddedPDV(fixed, new Uint8Array([ 0x00 ])).toString(),
            "EMBEDDED PDV { identification fixed : NULL , data-value '00'H }",
        );
    });
});

describe("CHARACTER STRING toString", () => {
    it("prints string-value in ASN.1 value notation", () => {
        const ident = new asn1.BERElement();
        ident.tagClass = asn1.ASN1TagClass.context;
        ident.construction = asn1.ASN1Construction.primitive;
        ident.tagNumber = 1;
        ident.objectIdentifier = asn1.ObjectIdentifier.fromParts([ 2, 1, 1 ]);
        const cs = new asn1.CharacterString(ident, Buffer.from("Hi"));
        assert.equal(
            cs.toString(),
            "CHARACTER STRING { identification syntax : { 2 1 1 } , string-value '4869'H }",
        );
        const el = new asn1.BERElement();
        el.characterString = cs;
        el.tagNumber = asn1.ASN1UniversalType.characterString;
        assert.equal(el.toString(), cs.toString());
    });
});
