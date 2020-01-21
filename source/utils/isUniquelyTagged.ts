import ASN1Element from "../asn1";

export default
function isUniquelyTagged (elements: ASN1Element[]): boolean {
    const finds: { [ key: string ]: null } = {};
    for (let i = 0; i < elements.length; i++) {
        const key: string = `${elements[i].tagClass}.${elements[i].tagNumber}`;
        if (key in finds) return false;
        finds[key] = null;
    }
    return true;
}
