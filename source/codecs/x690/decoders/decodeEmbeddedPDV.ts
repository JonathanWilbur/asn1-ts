import EmbeddedPDV from "../../../types/EmbeddedPDV";
import decodeSequence from "../../der/decoders/decodeSequence";
import { EMBEDDED_PDV } from "../../../macros";

export default
function decodeEmbeddedPDV (value: Uint8Array): EMBEDDED_PDV {
    const components = decodeSequence(value);
    const identification = components[0];
    const dataValue = components[1].octetString;
    return new EmbeddedPDV(identification, dataValue);
}
