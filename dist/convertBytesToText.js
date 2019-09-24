"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
function convertBytesToText(bytes, codec = "utf-8") {
    if (typeof TextEncoder !== "undefined") {
        return (new TextDecoder(codec)).decode(bytes.buffer);
    }
    else if (typeof Buffer !== "undefined") {
        return (Buffer.from(bytes)).toString(codec);
    }
    throw new errors_1.ASN1Error("Neither TextDecoder nor Buffer are defined to decode bytes into text.");
}
exports.default = convertBytesToText;
//# sourceMappingURL=convertBytesToText.js.map