import CERElement from "../../cer";
import { SEQUENCE } from "../../../macros";

export default
function decodeSequence (value: Uint8Array): SEQUENCE<CERElement> {
    if (value.length === 0) {
        return [];
    }
    const encodedElements: CERElement[] = [];
    let i: number = 0;
    while (i < value.length) {
        const next: CERElement = new CERElement();
        i += next.fromBytes(value.slice(i));
        encodedElements.push(next);
    }
    return encodedElements;
}
