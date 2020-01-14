import { EXTERNAL } from "../../../macros";
import DERElement from "../../../codecs/der";
import { ASN1TagClass, ASN1UniversalType, ASN1Construction } from "../../../values";
import ASN1Element from "../../../asn1";

export default
function encodeExternal (value: EXTERNAL): Uint8Array {
    let directReferenceElement: DERElement | undefined = undefined;
    if (value.directReference) {
        directReferenceElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.objectIdentifier,
            value.directReference,
        );
    }

    let indirectReferenceElement: DERElement | undefined = undefined;
    if (value.indirectReference) {
        indirectReferenceElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.primitive,
            ASN1UniversalType.integer,
            value.indirectReference,
        );
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
            value.encoding,
        );
    } else if (value.encoding instanceof Uint8Array) {
        encodingElement = new DERElement(
            ASN1TagClass.context,
            ASN1Construction.primitive,
            1,
            value.encoding,
        );
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
