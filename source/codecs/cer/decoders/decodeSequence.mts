import CERElement from "../../cer.mjs";
import type { SEQUENCE } from "../../../macros.mjs";

export default
function decodeSequence (value: Uint8Array): SEQUENCE<CERElement> {
    if (value.length === 0) {
        return [];
    }
    const encodedElements: CERElement[] = [];
    let i: number = 0;
    while (i < value.length) {
        const next: CERElement = new CERElement();
        i += next.fromBytes(value.subarray(i));
        encodedElements.push(next);
    }
    return encodedElements;
}
