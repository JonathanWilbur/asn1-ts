import CERElement from "../../cer";

export default
function decodeSequence (value: Uint8Array): CERElement[] {
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
