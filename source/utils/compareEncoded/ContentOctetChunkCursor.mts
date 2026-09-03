import type ASN1Element from "../../asn1.mjs";
import * as errors from "../../errors.mjs";
import { ASN1TagClass, ASN1Construction, ASN1UniversalType } from "../../values.mjs";
import { hasSequenceElements } from "../../brands.mjs";

/** Matches {@link ASN1Element.nestingRecursionLimit}. */
export const NESTING_RECURSION_LIMIT: number = 5;

/**
 * @summary Obtain constructed child elements without joining content octets.
 * @internal
 */
export function getConstructedChildren (el: ASN1Element): readonly ASN1Element[] {
    if (hasSequenceElements(el)) {
        return el.sequenceElements(false) as readonly ASN1Element[];
    }
    return el.sequence;
}

/**
 * @summary Validate a constructed string or OCTET STRING fragment.
 * @internal
 */
export function validateFragment (
    fragment: ASN1Element,
    fragmentTagNumber: number,
    dataType: string,
    context: ASN1Element,
): void {
    if (fragment.tagClass !== ASN1TagClass.universal) {
        throw new errors.ASN1ConstructionError(
            `Invalid tag class in constructed ${dataType}. Must be UNIVERSAL`,
            context,
        );
    }
    if (fragment.tagNumber !== fragmentTagNumber) {
        throw new errors.ASN1ConstructionError(
            fragmentTagNumber === ASN1UniversalType.bitString
                ? `Invalid tag number in constructed ${dataType}. Must be 3 (BIT STRING).`
                : `Invalid tag number in constructed ${dataType}. Must be 4 (OCTET STRING).`,
            context,
        );
    }
}

/**
 * @summary Walk primitively-encoded content-octet chunks of one ASN.1 element.
 * @internal
 */
function* walkElementChunks (
    el: ASN1Element,
    context: ASN1Element,
    fragmentTagNumber: number,
    dataType: string,
    depth: number,
): Generator<Uint8Array, void, undefined> {
    if (el.construction === ASN1Construction.primitive) {
        yield el.value;
        return;
    }
    const nextDepth: number = depth + 1;
    if (nextDepth > NESTING_RECURSION_LIMIT) {
        throw new errors.ASN1RecursionError();
    }
    const children: readonly ASN1Element[] = getConstructedChildren(el);
    for (const child of children) {
        validateFragment(child, fragmentTagNumber, dataType, context);
        yield* walkElementChunks(child, context, fragmentTagNumber, dataType, nextDepth);
    }
}

/**
 * @summary Iterate primitively-encoded content-octet chunks of a BER/CER value.
 * @description
 * Constructed string and OCTET STRING encodings may split content octets across
 * nested OCTET STRING fragments. This generator walks those fragments without
 * allocating a joined buffer. Each yielded value is a `Uint8Array` view
 * aliasing the underlying encoded bytes.
 *
 * Never call {@link ASN1Element.value} on a constructed operand through this
 * iterator; only primitive fragments read `value`.
 *
 * @param {ASN1Element | Uint8Array} source - An ASN.1 element or flat bytes.
 * @param {number} [fragmentTagNumber=ASN1UniversalType.octetString] - Universal
 * tag number required on each constructed fragment when `source` is an element.
 * @param {string} [dataType="OCTET STRING"] - Type name used in error messages.
 * @yields {Uint8Array} The next primitive content-octet buffer.
 * @generator
 * @function
 * @author Cursor Composer
 */
export default function* iterateContentOctetChunks (
    source: ASN1Element | Uint8Array,
    fragmentTagNumber: number = ASN1UniversalType.octetString,
    dataType: string = "OCTET STRING",
): Generator<Uint8Array, void, undefined> {
    if (source instanceof Uint8Array) {
        yield source;
        return;
    }
    yield* walkElementChunks(source, source, fragmentTagNumber, dataType, 0);
}
