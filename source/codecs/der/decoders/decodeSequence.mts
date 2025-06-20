import DERElement from "../../der.mjs";
import type { SEQUENCE } from "../../../macros.mjs";

export default
function decodeSequence (value: Uint8Array): SEQUENCE<DERElement> {
    if (value.length === 0) {
        return [];
    }
    const encodedElements: DERElement[] = [];
    let i: number = 0;
    while (i < value.length) {
        const next: DERElement = new DERElement();
        i += next.fromBytes(value.subarray(i));
        encodedElements.push(next);
    }
    return encodedElements;
}
