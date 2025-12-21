import type { EXTERNAL, SingleThreadUint8Array } from "../../../macros.mjs";
import DERElement from "../../../codecs/der.mjs";
import { ASN1TagClass, ASN1UniversalType, ASN1Construction } from "../../../values.mjs";
import ASN1Element from "../../../asn1.mjs";

export default
function encodeExternal (value: EXTERNAL): SingleThreadUint8Array {
    let directReferenceElement: DERElement | undefined = undefined;
    if (value.directReference) {
        directReferenceElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.objectIdentifier,
        );
        directReferenceElement.objectIdentifier = value.directReference;
    }

    let indirectReferenceElement: DERElement | undefined = undefined;
    if (value.indirectReference) {
        indirectReferenceElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.integer,
        );
        indirectReferenceElement.integer = value.indirectReference;
    }

    let dataValueDescriptorElement: DERElement | undefined = undefined;
    if (value.dataValueDescriptor) {
        dataValueDescriptorElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.objectDescriptor,
        );
        dataValueDescriptorElement.objectDescriptor = value.dataValueDescriptor;
    }

    let encodingElement: DERElement | undefined = undefined;
    if (value.encoding instanceof ASN1Element) {
        encodingElement = new DERElement(
            ASN1TagClass.context,
            ASN1Construction.constructed,
            0,
            // value.encoding,
        );
        encodingElement.inner = value.encoding;
    } else if (value.encoding instanceof Uint8Array) {
        encodingElement = new DERElement(
            ASN1TagClass.context,
            ASN1Construction.primitive,
            1,
        );
        encodingElement.octetString = value.encoding;
    } else {
        encodingElement = new DERElement(
            ASN1TagClass.context,
            ASN1Construction.primitive,
            2,
        );
        encodingElement.bitString = value.encoding;
    }

    const ret: DERElement = DERElement.fromSequence([
        directReferenceElement,
        indirectReferenceElement,
        dataValueDescriptorElement,
        encodingElement,
    ]);
    return ret.value;
}
