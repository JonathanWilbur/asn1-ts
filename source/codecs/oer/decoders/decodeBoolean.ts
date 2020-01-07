import * as errors from "../../../errors";

export default
function decodeBoolean (value: Uint8Array): boolean {
    if (value.length !== 1) {
        throw new errors.ASN1SizeError("BOOLEAN not one byte");
    }
    return (value[0] !== 0);
}
