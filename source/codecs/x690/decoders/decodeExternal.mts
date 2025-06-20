import External from "../../../types/External.mjs";
import { ASN1TagClass, ASN1UniversalType } from "../../../values.mjs";
import ASN1Element from "../../../asn1.mjs";
import * as errors from "../../../errors.mjs";
import decodeSequence from "../../der/decoders/decodeSequence.mjs";
import type {
    BIT_STRING,
    EXTERNAL,
    ObjectDescriptor,
    OPTIONAL,
    INTEGER,
    OBJECT_IDENTIFIER,
} from "../../../macros.mjs";

export default
function decodeExternal (value: Uint8Array): EXTERNAL {
    const components = decodeSequence(value);
    let i: number = 0;
    const directReference: OPTIONAL<OBJECT_IDENTIFIER> = (
        (components[i]?.tagNumber === ASN1UniversalType.objectIdentifier)
        && (components[i].tagClass === ASN1TagClass.universal)
    )
        ? components[i++].objectIdentifier
        : undefined;
    const indirectReference: OPTIONAL<INTEGER> = (
        (components[i]?.tagNumber === ASN1UniversalType.integer)
        && (components[i].tagClass === ASN1TagClass.universal)
    )
        ? components[i++].integer
        : undefined;
    const dataValueDescriptor: OPTIONAL<ObjectDescriptor> = (
        (components[i]?.tagNumber === ASN1UniversalType.objectDescriptor)
        && (components[i].tagClass === ASN1TagClass.universal)
    )
        ? components[i++].objectDescriptor
        : undefined;
    if (!directReference && !indirectReference) {
        throw new errors.ASN1ConstructionError("EXTERNAL must have direct or indirect reference.");
    }
    const encodingElement = components[i];
    if (!encodingElement || encodingElement.tagClass !== ASN1TagClass.context) {
        throw new errors.ASN1ConstructionError("EXTERNAL missing 'encoding' component.");
    }
    const encoding = ((): ASN1Element | Uint8Array | BIT_STRING => {
        switch (encodingElement.tagNumber) {
        case (0): return encodingElement.inner;
        case (1): return encodingElement.octetString
        case (2): return encodingElement.bitString
        default: {
            throw new errors.ASN1UndefinedError(
                "EXTERNAL does not know of an encoding option "
                + `having tag number ${encodingElement.tagNumber}.`,
            );
        }
        }
    })();
    return new External(
        directReference,
        indirectReference,
        dataValueDescriptor,
        encoding,
    );
}
