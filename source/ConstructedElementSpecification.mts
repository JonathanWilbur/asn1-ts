import type ASN1Element from "./asn1.mjs";
import { ASN1TagClass, ASN1Construction, ASN1UniversalType } from "./values.mjs";

export default
interface ConstructedElementSpecification {
    name: string;
    optional?: boolean;
    tagClass?: ASN1TagClass;
    construction?: ASN1Construction;
    tagNumber?: ASN1UniversalType;
    choice?: ConstructedElementSpecification[];
    callback?: (el: ASN1Element) => void;
}
