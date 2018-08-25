export const MAX_UINT_32 : number = 0x00FFFFFFFF;
export const MIN_UINT_32 : number = 0x0000000000;
export const MAX_SINT_32 : number = 0x7FFFFFFF;
export const MIN_SINT_32 : number = -0x7FFFFFFF;

export
enum ASN1TagClass {
    universal = 0,
    application = 1,
    context = 3,
    private = 4
}

export
enum ASN1Construction {
    primitive = 0,
    constructed = 1
}

export
enum LengthEncodingPreference {
    definite,
    indefinite
}

export
enum ASN1SpecialRealValue
{
    plusInfinity = 0b01000000,
    minusInfinity = 0b01000001,
    notANumber = 0b01000010,
    minusZero = 0b01000011
}

export
enum ASN1UniversalType
{
    endOfContent = 0x00,
    boolean = 0x01,
    integer = 0x02,
    bitString = 0x03,
    octetString = 0x04,
    nill = 0x05,
    objectIdentifier = 0x06,
    objectDescriptor = 0x07,
    external = 0x08,
    realNumber = 0x09,
    enumerated = 0x0A,
    embeddedPDV = 0x0B,
    utf8String = 0x0C,
    relativeOID = 0x0D,
    reserved14 = 0x0E,
    reserved15 = 0x0F,
    sequence = 0x10,
    set = 0x11,
    numericString = 0x12,
    printableString = 0x13,
    teletexString = 0x14,
    videotexString = 0x15,
    ia5String = 0x16,
    utcTime = 0x17,
    generalizedTime = 0x18,
    graphicString = 0x19,
    visibleString = 0x1A,
    generalString = 0x1B,
    universalString = 0x1C,
    characterString = 0x1D,
    bmpString = 0x1E
}

/**
    The acceptable characters for a printableString.
    The sorting of letters below is a slight optimization:
    they are sorted in order of decreasing frequency in the English
    language, so that canFind will usually have to iterate through
    fewer letters before finding a match.
*/
export const printableStringCharacters : string =
    "etaoinsrhdlucmfywgpbvkxqjzETAOINSRHDLUCMFYWGPBVKXQJZ0123456789 '()+,-./:=?";

export const utcTimeRegex : RegExp =
    /^(?<year>\d{2})(?<month>\d{2})(?<date>\d{2})(?<hour>\d{2})(?<minute>\d{2})(?<second>\d{2})?(?<offset>(?:(\+|\-)\d{4})|Z)$/;

export const generalizedTimeRegex : RegExp =
    /^(?<year>\d{4})(?<month>\d{2})(?<date>\d{2})(?<hour>\d{2})(?<minute>\d{2})?(?<second>\d{2})?(?:\.(?<millisecond>\d+))?(?<offset>(?:(\+|\-)\d{4})|Z)?$/;