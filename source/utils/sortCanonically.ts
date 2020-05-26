import ASN1Element from "../asn1";
import { CANONICAL_TAG_CLASS_ORDERING } from "../values";

export default
function sortCanonically (elements: ASN1Element[]): void {
    elements.sort((a, b): number => {
        const aClassOrder = CANONICAL_TAG_CLASS_ORDERING.findIndex((ctco) => ctco === a.tagClass);
        const bClassOrder = CANONICAL_TAG_CLASS_ORDERING.findIndex((ctco) => ctco === b.tagClass);
        if (aClassOrder !== bClassOrder) {
            return (aClassOrder - bClassOrder);
        }
        return (a.tagNumber - b.tagNumber);
    });
}
