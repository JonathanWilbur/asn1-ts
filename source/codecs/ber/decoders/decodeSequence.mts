import BERElement from "../../ber.mjs";
import type { SEQUENCE } from "../../../macros.mjs";

export default
function decodeSequence (value: Uint8Array): SEQUENCE<BERElement> {
    const encodedElements: BERElement[] = [];
    let i: number = 0;
    while (i < value.length) {
        const next: BERElement = new BERElement();
        i += next.fromBytes(value.subarray(i));
        encodedElements.push(next);
    }
    return encodedElements;
}
