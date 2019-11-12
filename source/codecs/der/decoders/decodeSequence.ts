import DERElement from "../../der";

export default
function decodeSequence (value: Uint8Array): DERElement[] {
    if (value.length === 0) {
        return [];
    }
    const encodedElements: DERElement[] = [];
    let i: number = 0;
    while (i < value.length) {
        const next: DERElement = new DERElement();
        i += next.fromBytes(value.slice(i));
        encodedElements.push(next);
    }
    return encodedElements;
}
