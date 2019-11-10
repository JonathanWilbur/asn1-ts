import External from "../../../types/External";
import { ASN1TagClass, ASN1UniversalType } from "../../../values";
import { ASN1Element } from "../../../asn1";
import ConstructedElementSpecification from "../../../ConstructedElementSpecification";
import * as errors from "../../../errors";
import { ObjectIdentifier } from "../../../types/objectidentifier";
import validateConstruction from "../../../validateConstruction";
import decodeSequence from "../../der/decoders/decodeSequence";

export default
function decodeExternal (value: Uint8Array): External {
    let directReference: ObjectIdentifier | undefined = undefined;
    let indirectReference: number | undefined = undefined;
    let dataValueDescriptor: string | undefined = undefined;
    let encoding!: ASN1Element | Uint8Array | boolean[];
    const specification: ConstructedElementSpecification[] = [
        {
            name: "directReference",
            optional: true,
            tagClass: ASN1TagClass.universal,
            tagNumber: ASN1UniversalType.objectIdentifier,
            callback: (el: ASN1Element): void => {
                directReference = el.objectIdentifier;
            },
        },
        {
            name: "indirectReference",
            optional: true,
            tagClass: ASN1TagClass.universal,
            tagNumber: ASN1UniversalType.integer,
            callback: (el: ASN1Element): void => {
                indirectReference = el.integer;
            },
        },
        {
            name: "dataValueDescriptor",
            optional: true,
            tagClass: ASN1TagClass.universal,
            tagNumber: ASN1UniversalType.objectDescriptor,
            callback: (el: ASN1Element): void => {
                dataValueDescriptor = el.objectDescriptor;
            },
        },
        {
            name: "encoding",
            optional: true,
            tagClass: ASN1TagClass.context,
            callback: (el: ASN1Element): void => {
                switch (el.tagNumber) {
                case (0): {
                    encoding = el;
                    break;
                }
                case (1): {
                    encoding = el.octetString;
                    break;
                }
                case (2): {
                    encoding = el.bitString;
                    break;
                }
                default: {
                    throw new errors.ASN1UndefinedError(
                        "EXTERNAL does not know of an encoding option "
                        + `having tag number ${el.tagNumber}.`,
                    );
                }
                }
            },
        },
    ];
    validateConstruction(decodeSequence(value), specification);
    return new External(
        directReference,
        indirectReference,
        dataValueDescriptor,
        encoding,
    );
}
