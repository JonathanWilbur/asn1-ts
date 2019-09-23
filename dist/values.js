"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_UINT_32 = 0x00FFFFFFFF;
exports.MIN_UINT_32 = 0x0000000000;
exports.MAX_SINT_32 = 0x7FFFFFFF;
exports.MIN_SINT_32 = -0x80000000;
var ASN1TagClass;
(function (ASN1TagClass) {
    ASN1TagClass[ASN1TagClass["universal"] = 0] = "universal";
    ASN1TagClass[ASN1TagClass["application"] = 1] = "application";
    ASN1TagClass[ASN1TagClass["context"] = 2] = "context";
    ASN1TagClass[ASN1TagClass["private"] = 3] = "private";
})(ASN1TagClass = exports.ASN1TagClass || (exports.ASN1TagClass = {}));
var ASN1Construction;
(function (ASN1Construction) {
    ASN1Construction[ASN1Construction["primitive"] = 0] = "primitive";
    ASN1Construction[ASN1Construction["constructed"] = 1] = "constructed";
})(ASN1Construction = exports.ASN1Construction || (exports.ASN1Construction = {}));
var LengthEncodingPreference;
(function (LengthEncodingPreference) {
    LengthEncodingPreference[LengthEncodingPreference["definite"] = 0] = "definite";
    LengthEncodingPreference[LengthEncodingPreference["indefinite"] = 1] = "indefinite";
})(LengthEncodingPreference = exports.LengthEncodingPreference || (exports.LengthEncodingPreference = {}));
var ASN1SpecialRealValue;
(function (ASN1SpecialRealValue) {
    ASN1SpecialRealValue[ASN1SpecialRealValue["plusInfinity"] = 64] = "plusInfinity";
    ASN1SpecialRealValue[ASN1SpecialRealValue["minusInfinity"] = 65] = "minusInfinity";
    ASN1SpecialRealValue[ASN1SpecialRealValue["notANumber"] = 66] = "notANumber";
    ASN1SpecialRealValue[ASN1SpecialRealValue["minusZero"] = 67] = "minusZero";
})(ASN1SpecialRealValue = exports.ASN1SpecialRealValue || (exports.ASN1SpecialRealValue = {}));
var ASN1RealEncodingBase;
(function (ASN1RealEncodingBase) {
    ASN1RealEncodingBase[ASN1RealEncodingBase["base2"] = 0] = "base2";
    ASN1RealEncodingBase[ASN1RealEncodingBase["base8"] = 16] = "base8";
    ASN1RealEncodingBase[ASN1RealEncodingBase["base16"] = 32] = "base16";
})(ASN1RealEncodingBase = exports.ASN1RealEncodingBase || (exports.ASN1RealEncodingBase = {}));
var ASN1RealEncodingScale;
(function (ASN1RealEncodingScale) {
    ASN1RealEncodingScale[ASN1RealEncodingScale["scale0"] = 0] = "scale0";
    ASN1RealEncodingScale[ASN1RealEncodingScale["scale1"] = 4] = "scale1";
    ASN1RealEncodingScale[ASN1RealEncodingScale["scale2"] = 8] = "scale2";
    ASN1RealEncodingScale[ASN1RealEncodingScale["scale3"] = 12] = "scale3";
})(ASN1RealEncodingScale = exports.ASN1RealEncodingScale || (exports.ASN1RealEncodingScale = {}));
var ASN1UniversalType;
(function (ASN1UniversalType) {
    ASN1UniversalType[ASN1UniversalType["endOfContent"] = 0] = "endOfContent";
    ASN1UniversalType[ASN1UniversalType["boolean"] = 1] = "boolean";
    ASN1UniversalType[ASN1UniversalType["integer"] = 2] = "integer";
    ASN1UniversalType[ASN1UniversalType["bitString"] = 3] = "bitString";
    ASN1UniversalType[ASN1UniversalType["octetString"] = 4] = "octetString";
    ASN1UniversalType[ASN1UniversalType["nill"] = 5] = "nill";
    ASN1UniversalType[ASN1UniversalType["objectIdentifier"] = 6] = "objectIdentifier";
    ASN1UniversalType[ASN1UniversalType["objectDescriptor"] = 7] = "objectDescriptor";
    ASN1UniversalType[ASN1UniversalType["external"] = 8] = "external";
    ASN1UniversalType[ASN1UniversalType["realNumber"] = 9] = "realNumber";
    ASN1UniversalType[ASN1UniversalType["enumerated"] = 10] = "enumerated";
    ASN1UniversalType[ASN1UniversalType["embeddedPDV"] = 11] = "embeddedPDV";
    ASN1UniversalType[ASN1UniversalType["utf8String"] = 12] = "utf8String";
    ASN1UniversalType[ASN1UniversalType["relativeOID"] = 13] = "relativeOID";
    ASN1UniversalType[ASN1UniversalType["reserved14"] = 14] = "reserved14";
    ASN1UniversalType[ASN1UniversalType["reserved15"] = 15] = "reserved15";
    ASN1UniversalType[ASN1UniversalType["sequence"] = 16] = "sequence";
    ASN1UniversalType[ASN1UniversalType["set"] = 17] = "set";
    ASN1UniversalType[ASN1UniversalType["numericString"] = 18] = "numericString";
    ASN1UniversalType[ASN1UniversalType["printableString"] = 19] = "printableString";
    ASN1UniversalType[ASN1UniversalType["teletexString"] = 20] = "teletexString";
    ASN1UniversalType[ASN1UniversalType["videotexString"] = 21] = "videotexString";
    ASN1UniversalType[ASN1UniversalType["ia5String"] = 22] = "ia5String";
    ASN1UniversalType[ASN1UniversalType["utcTime"] = 23] = "utcTime";
    ASN1UniversalType[ASN1UniversalType["generalizedTime"] = 24] = "generalizedTime";
    ASN1UniversalType[ASN1UniversalType["graphicString"] = 25] = "graphicString";
    ASN1UniversalType[ASN1UniversalType["visibleString"] = 26] = "visibleString";
    ASN1UniversalType[ASN1UniversalType["generalString"] = 27] = "generalString";
    ASN1UniversalType[ASN1UniversalType["universalString"] = 28] = "universalString";
    ASN1UniversalType[ASN1UniversalType["characterString"] = 29] = "characterString";
    ASN1UniversalType[ASN1UniversalType["bmpString"] = 30] = "bmpString";
})(ASN1UniversalType = exports.ASN1UniversalType || (exports.ASN1UniversalType = {}));
exports.printableStringCharacters = "etaoinsrhdlucmfywgpbvkxqjzETAOINSRHDLUCMFYWGPBVKXQJZ0123456789 '()+,-./:=?";
exports.utcTimeRegex = /^(\d{2})((?:1[0-2])|(?:0\d))((?:3[01])|(?:[0-2]\d))((?:2[0-3])|(?:[01]\d))([0-5]\d)(?:[0-5]\d)?((?:(\+|\-)((?:2[0-3])|(?:[01]\d))[0-5]\d)|Z)$/;
exports.generalizedTimeRegex = /^(\d{4})((?:1[0-2])|(?:0\d))((?:3[01])|(?:[0-2]\d))((?:2[0-3])|(?:[01]\d))([0-5]\d)?([0-5]\d)?(?:(\.|,)(\d+))?((?:(\+|\-)((?:2[0-3])|(?:[01]\d))[0-5]\d)|Z)?$/;
exports.nr1Regex = /^\ *(\+|\-)?\d+$/;
exports.nr2Regex = /^\ *(\+|\-)?(?:\d+(\.|,)\d*)|(?:\d*(\.|,)\d+)$/;
exports.nr3Regex = /^\ *(\+|\-)?(?:\d+(\.|,)\d*)|(?:\d*(\.|,)\d+)(e|E)(\+|\-)?\d+$/;
exports.canonicalNR3Regex = /^\ *\-?(?:[1-9]\d*)?[1-9]\.E(?:\+0)|(?:\-?[1-9]\d*)$/;
exports.distinguishedNR3Regex = /^\ *\-?(?:[1-9]\d*)?[1-9]\.E(?:\+0)|(?:\-?[1-9]\d*)$/;
exports.CANONICAL_TAG_CLASS_ORDERING = [
    ASN1TagClass.universal,
    ASN1TagClass.application,
    ASN1TagClass.private,
    ASN1TagClass.context,
];
//# sourceMappingURL=values.js.map