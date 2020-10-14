import type ASN1Element from "../asn1";

export default
function isUniquelyTagged (elements: ASN1Element[]): boolean {
    const finds: Set<string> = new Set<string>([]);
    for (let i = 0; i < elements.length; i++) {
        const key: string = `${elements[i].tagClass}.${elements[i].tagNumber}`;
        if (finds.has(key)) {
            return false;
        }
        finds.add(key);
    }
    return true;
}
