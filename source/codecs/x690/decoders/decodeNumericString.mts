import convertBytesToText from "../../../utils/convertBytesToText.mjs";
import { ASN1CharactersError } from "../../../errors.mjs";
import type { NumericString } from "../../../macros.mjs";

export default
function decodeNumericString (value: Uint8Array): NumericString {
    for (let i = 0; i < value.length; i++) {
        const c = value[i];
        if (c !== 0x20 && ((c - 0x30) >>> 0) > 9) {
            throw new ASN1CharactersError(
                "NumericString can only contain characters 0 - 9 and space. "
                + `Encountered character code ${c}.`,
            );
        }
    }
    return convertBytesToText(value);
}
